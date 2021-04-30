from django.shortcuts import render
from django.http import HttpResponse
import numpy as np
import io
import cv2
import pytesseract
from django.conf import settings

# Create your views here.
lang_key = {"tamil":"tam","english":"eng"}

RENDERING_OBJECT = settings.SITE_WHOLE_ADDRESS

def ocr(request,lang):
    if request.method == "POST" and request.FILES.get("files") and lang in lang_key:
        file = request.FILES.get("files")
        file_bytes = np.asarray(bytearray(file.read()), dtype=np.uint8)
        frame = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        text = read_img(frame,lang_key[lang])
        return HttpResponse(text)
    elif lang in lang_key:
        RENDERING_OBJECT['language'] = lang
        return render(request,'ocr/ocr.html',RENDERING_OBJECT)
    return HttpResponse("we are not supporting this language")


def read_img(img,lan):
    pytesseract.pytesseract.tesseract_cmd = '/app/.apt/usr/bin/tesseract'
    text = pytesseract.image_to_string(img,lang=lan)
    return text