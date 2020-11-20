---
title: WebGL CNN
link: https://cci-webgl-convnet.netlify.app/
code: https://github.com/joshmurr/cci-webgl-cnn/
img: webgl_cnn_shoe.png
---

An experiment which spiralled out of control resulting in shader based convolutional neural network using GLSL and WebGL. It is a small Javascript library which allows you to create model layers dynamically connecting the output of one layer into the next. Each layer can only perform a downsampling or upsampling 2D convolution. The output of each layer is a 3D tensor flattened into a 2D texture. Weights and biases can be uploaded as textures to specific layers and input data can be updated dynamically for video.

