
from flask import Flask,jsonify,send_file,request
import requests
from PIL import Image
import io
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Members api route
@app.route("/", methods=['GET'])
def checking():
    return ("Hello World First page")

@app.route("/api/home", methods=['GET'])
def return_home():
    return jsonify({
        'message':"Hello World",
        'people': ["jack","sparrow", "Barry"]
        })


@app.route('/resizer/image/width=<int:width>,quality=<int:quality>/<path:image_url>')
def resize_image(width, quality,image_url):
    width_var=request.view_args["width"]
    quality_var=request.view_args["quality"]
    print('width is' + str(width_var))
    print("quality is " + str(quality))
    # Construct the full URL
    #full_url = 'https://' + image_url
    full_url=image_url
    if not image_url.startswith(('http://', 'https://')):
        full_url = 'https://' + image_url
    print(full_url)
    # Fetch and process the image
    response = requests.get(full_url)
    image = Image.open(io.BytesIO(response.content))
    image = image.resize((width, width), Image.Resampling.LANCZOS)
    img_io = io.BytesIO()
    image.save(img_io, 'JPEG', quality=quality)
    img_io.seek(0)

    return send_file(img_io, mimetype='image/jpeg')

if __name__ == "__main__":
    app.run(debug=True, port=8080)
#/<path:image_url>

