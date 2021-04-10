from django.http import HttpResponse
from PyPDF2 import PdfFileMerger, PdfFileReader, PdfFileWriter
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from .models import Link
import string
import random
import os
from django.conf import settings

LENGTH = 20

def generate_random_link():
    res=""
    while res=="" or len(Link.objects.filter(link=res))!=0:
        res = ''.join(random.choices(string.ascii_uppercase + string.digits, k = LENGTH))
    return res
def create_path(rand):
    newPath=os.path.join(settings.BASE_DIR,"media/"+rand)
    os.mkdir(newPath)

def simple_upload(request):
    if request.method == 'POST':
        rand=generate_random_link()
        try:
            create_path(rand)
        except:
            return HttpResponse("path not creatd")
        request.session['link']=rand

        try:
            fs = FileSystemStorage(location="media/"+rand)
            values = request.POST.getlist("values")
        except:
            return HttpResponse("second")

        try:
            i=0
            for x in request.FILES.getlist("files"):
                fs.save(str(i)+".pdf",x)
                i+=1
        except:
            return HttpResponse("third") 
        type=request.POST.get("type")

        try:
            if type=="Normal":
                normal_merge(fs,values)
            elif type=="2" or type=="4":
                page_merge(fs,int(type),values)
            return HttpResponse(rand)
        except:
            return HttpResponse("pypdf2")
    return render(request, 'pdfupload/index.html')

def make_download(request,randomlink):
    filename = "output.pdf"
    fl_path = os.path.abspath(settings.BASE_DIR)+"/media/"+randomlink+"/"+filename
    fl = open(fl_path, 'rb')
    response = HttpResponse(fl)
    response['Content-Disposition'] = "attachment; filename=%s" % filename
    return response

def normal_merge(fs,values):
    loc = fs.location
    mergedObject = PdfFileMerger()
    for i in values:
        mergedObject.append(PdfFileReader(loc+"/"+i+".pdf", 'rb'))
    mergedObject.write(loc+"/output.pdf")

def page_merge(fs,type,values):
    loc = fs.location
    out_path = loc+"/output.pdf"
    writer = PdfFileWriter()
    for i in values:
        reader = PdfFileReader(loc+"/"+i+".pdf")
        for j in range(reader.getNumPages()):
            writer.addPage(reader.getPage(j))
        _, _, w, h = reader.getPage(0)['/MediaBox']
        for j in range((type-reader.getNumPages()%type)%type):
            writer.addBlankPage(w,h)
    with open(out_path,"wb") as output:
        writer.write(output)