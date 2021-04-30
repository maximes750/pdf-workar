from django.shortcuts import render
from PIL import Image
import mimetypes
import io
from django.http import HttpResponse
from django.conf import settings

# Create your views here.
def compress(request):
    if request.method == 'POST' and request.FILES['files']:
        fl = request.FILES['files']
        typ = fl.content_type.replace('image/','').upper()
        fl = Image.open(fl)
        quality = int(request.POST.get('quality'))
        if quality<0 or quality>100:
            quality = 80
        byte = io.BytesIO()
        fl.save(byte,format=typ,quality=quality)
        response = HttpResponse(byte.getvalue(),content_type="image/*")
        response['Content-Disposition'] = "attachment; filename=output.pdf"
        return response
    return render(request,'img_compress/compress.html',settings.SITE_WHOLE_ADDRESS)