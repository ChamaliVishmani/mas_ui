# Q&A Chatbot
import PIL.Image
import google.generativeai as genai
import textwrap
from IPython.display import display
from IPython.display import Markdown
from dotenv import load_dotenv
import streamlit as st
import os
from langchain_openai import OpenAI
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import replicate

nltk.download('stopwords')
nltk.download('punkt')
nltk.download('wordnet')


load_dotenv()  # take environment variables from .env.

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)


def get_root_words(prompt):
    # Text cleaning
    text = prompt.lower()

    # Tokenization
    tokens = word_tokenize(text)

    # Stopword removal
    stop_words = set(stopwords.words('english'))
    tokens = [token for token in tokens if token not in stop_words]

    # Lemmatization
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(token) for token in tokens]

    # Join the tokens back into refined text
    refined_text = ' '.join(tokens)

    return refined_text


st.set_page_config(page_title="Text prompt to Image AI")
st.header("Generate AI garment design from text and image")

user_text_input = st.text_input("Enter design text:", key="input")


def refine_text_prompt(text_input):

    llm = OpenAI(openai_api_key=OPENAI_API_KEY,
                 model_name="gpt-3.5-turbo-instruct", temperature=0.5)

    refined_text_prompt = llm(
        "Generate a text prompt for a text to image AI model to create a unique garment cloth design. Include keywords related to the style, theme, and features in the design. The generated text should inspire the AI model to generate a detailed and imaginative the garment cloth. The user's preferences are "+text_input)

    return refined_text_prompt


refined_text_prompt = None
refine_text_prompt_btn = st.button("Refine text prompt")

# if submit button is clicked
if refine_text_prompt_btn:
    refined_text_prompt = refine_text_prompt(user_text_input)
    # keywords = get_root_words(user_text_input)
    st.subheader("The refined text prompt is:")
    st.write(refined_text_prompt)
    # st.write(keywords)

# if refined_text_prompt is not None:
#     generate_image_btn = st.button("Generate Image")
    with st.spinner("Generating Image..."):
        # if generate_image_btn:

        output = replicate.run(
            "konieshadow/fooocus-api:fda927242b1db6affa1ece4f54c37f19b964666bf23b0d06ae2439067cd344a4",
            input={
                "prompt": refined_text_prompt,
                "cn_type1": "ImagePrompt",
                "cn_type2": "ImagePrompt",
                "cn_type3": "ImagePrompt",
                "cn_type4": "ImagePrompt",
                "sharpness": 2,
                "image_seed": 50403806253646856,
                "uov_method": "Disabled",
                "image_number": 1,
                "guidance_scale": 4,
                "refiner_switch": 0.5,
                "style_selections": "Fooocus V2,Fooocus Enhance,Fooocus Sharp",
                "uov_upscale_value": 0,
                "outpaint_selections": "",
                "outpaint_distance_top": 0,
                "performance_selection": "Speed",
                "outpaint_distance_left": 0,
                "aspect_ratios_selection": "1152*896",
                "outpaint_distance_right": 0,
                "outpaint_distance_bottom": 0,
                "inpaint_additional_prompt": ""
            }
        )
        print(output)
        st.image(output[0])
        # st.write(output[0])
        # st.download_button(label="Download Image",
        #                    data=output, file_name="image.jpg")
        st.markdown(
            f"[Download Image]({output[0]})", unsafe_allow_html=True)
        # st.download_button(label="Download Image", data=output[0])

img_input = st.file_uploader(
    "Upload an image to make a variation", type=["jpg", "png"])
model = genai.GenerativeModel('gemini-pro-vision')
if img_input:
    img = PIL.Image.open(img_input)
    st.image(img)
    about_img = model.generate_content(img)
    st.subheader("About the image uploaded : ")
    st.write(about_img.text)

variation_input = st.text_input("Variation input:", key="variation_input")
variation_Btn = st.button("Make variation")
variation_keywords = get_root_words(variation_input)

if variation_Btn:
    st.subheader("The variation text prompt is:")
    prompt_for_prompt = f"Generate a text prompt for an text+image to image generation AI model to create a unique garment design by varying image given. Consider including keywords related to the style, theme, and features  in the design. Use the user's input for inspiration: '{variation_input}'."
    response = model.generate_content(
        [prompt_for_prompt, img], stream=True)
    response.resolve()
    st.write(response.text)

    with st.spinner("Generating Image..."):
        output = replicate.run(
            "konieshadow/fooocus-api:fda927242b1db6affa1ece4f54c37f19b964666bf23b0d06ae2439067cd344a4",
            input={
                "prompt": variation_input,
                "cn_type1": "ImagePrompt",
                "cn_type2": "ImagePrompt",
                "cn_type3": "ImagePrompt",
                "cn_type4": "ImagePrompt",
                "sharpness": 2,
                "image_seed": 50403806253646856,
                "uov_method": "Disabled",
                "image_number": 1,
                "guidance_scale": 4,
                "refiner_switch": 0.5,
                "style_selections": "Fooocus V2,Fooocus Enhance,Fooocus Sharp",
                "uov_upscale_value": 0,
                "inpaint_input_image": img_input,
                "outpaint_selections": "",
                "outpaint_distance_top": 0,
                "performance_selection": "Speed",
                "outpaint_distance_left": 0,
                "aspect_ratios_selection": "1152*896",
                "outpaint_distance_right": 0,
                "outpaint_distance_bottom": 0,
                "inpaint_additional_prompt": "response.text"
            }
        )
    print(output)
    st.image(output[0])
    # st.write(output[0])
    # st.download_button(label="Download Image",
    #                    data=output, file_name="image.jpg")
    st.markdown(
        f"[Download Image]({output[0]})", unsafe_allow_html=True)
    # st.download_button(label="Download Image", data=output[0])
