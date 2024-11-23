### Represent
```bash
http POST http://localhost:5000/represent \
    img="test_img\img_0.jpg" \
    model_name="VGG-Face" \
    detector_backend="opencv" \
    enforce_detection:=true \
    align:=true
```

```bash
http POST http://localhost:5000/represent img="test_img\img_0.jpg" model_name="VGG-Face" detector_backend="opencv" enforce_detection:=true align:=true
```

```javascript
fetch('http://localhost:5000/represent', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        img: "<image_base64_or_url>",
        model_name: "VGG-Face",
        detector_backend: "opencv",
        enforce_detection: true,
        align: true
    })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```


### Verify 1
```bash
http POST http://localhost:5000/verify \
    img1="test_img\img_0.jpg" \
    img2="test_img\img_1.jpg" \
    model_name="VGG-Face" \
    detector_backend="opencv" \
    distance_metric="cosine" \
    enforce_detection:=true \
    align:=true
```

```bash
http POST http://localhost:5000/verify img1="test_img\img_0.jpg" img2="test_img\img_1.jpg" model_name="VGG-Face" detector_backend="opencv" distance_metric="cosine" enforce_detection:=true align:=true
```

```javascript
fetch('http://localhost:5000/verify', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        img1: "<image1_base64_or_url>",
        img2: "<image2_base64_or_url>",
        model_name: "VGG-Face",
        detector_backend: "opencv",
        distance_metric: "cosine",
        enforce_detection: true,
        align: true
    })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Verify 2
```bash
http POST http://localhost:5000/verify \
    img1="test_img\img_0.jpg" \
    img2="test_img\img_4.jpg" \
    model_name="VGG-Face" \
    detector_backend="opencv" \
    distance_metric="cosine" \
    enforce_detection:=true \
    align:=true
```

```bash
http POST http://localhost:5000/verify img1="test_img\img_0.jpg" img2="test_img\img_4.jpg" model_name="VGG-Face" detector_backend="opencv" distance_metric="cosine" enforce_detection:=true align:=true
```

```javascript
fetch('http://localhost:5000/verify', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        img1: "<image1_base64_or_url>",
        img2: "<image2_base64_or_url>",
        model_name: "VGG-Face",
        detector_backend: "opencv",
        distance_metric: "cosine",
        enforce_detection: true,
        align: true
    })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```