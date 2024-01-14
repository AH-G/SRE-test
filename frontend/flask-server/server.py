from flask import Flask,jsonify,send_file,request, Response
import requests
from PIL import Image, ImageDraw, ImageFont
import io
from flask_cors import CORS
from prometheus_flask_exporter import PrometheusMetrics
import prometheus_client
from prometheus_client.core import CollectorRegistry
from prometheus_client import Summary, Counter, Histogram, Gauge

app = Flask(__name__)
metrics = PrometheusMetrics(app)
CORS(app)

metric = Counter('python_request_operations_total', 'The total number of processed requests')
# Members api route
@app.route("/", methods=['GET'])
def checking():
    return ("Hello World First page")


@app.route("/metrics")
def requests_count():
    res = []
    res.append(prometheus_client.generate_latest(metric))
    return Response(res, mimetype="text/plain")

@app.route('/resizer/image/width=<int:width>,quality=<int:quality>/<path:image_url>', methods=['GET'])
def resize_image(width, quality,image_url):
    metric.inc()
    width_var=request.view_args["width"]
    quality_var=request.view_args["quality"]
    print('width is' + str(width_var))
    print("quality is " + str(quality))
    
    full_url=image_url
    if not image_url.startswith(('http://', 'https://')):
        full_url = 'https://' + image_url
    print(full_url)
    # Fetch and process the image
    response = requests.get(full_url)
    image = Image.open(io.BytesIO(response.content))
    image = image.resize((width, width), Image.Resampling.LANCZOS)
    drawing = ImageDraw.Draw(image)
    font = ImageFont.truetype("./Arial.ttf", 50)
    fill_color = (203,201,201)
    watermark_text = "SRE-TEST"
    x = width/2 - 50
    position = (x, x)
    drawing.text(xy = position, text = watermark_text, font = font, fill = fill_color)
    img_io = io.BytesIO()
    image.save(img_io, 'JPEG', quality=quality)
    img_io.seek(0)

    return send_file(img_io, mimetype='image/jpeg')

if __name__ == "__main__":
    app.run(debug=True, port=8080, host='0.0.0.0')


