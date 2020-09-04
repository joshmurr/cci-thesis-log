---
layout: post
title:  "Using Jupyter Notebook with Docker Containers"
date:   2020-08-17 13:19:36 +0100
categories: ideas
---

I have had a week to play with the _CCI GFX PC_ now and it has mostly been a week getting to know the machine and to actually do some hands-on work with machine learning. We had a term of theory with Vitek which was amazing, but a little frustrating not being able to put things into practice, so to have a machine which is powerful enough to train models on at home is great fun.

I have implemented the [pix2pix][p2p] and [CycleGAN][cgan] models as per the Tensorflow tutorial section, as it's most likely that these types of generative models will become the basis of all future work for this particular project. Mick planted the idea in one of our early meetings that getting something like Memo Aktens [_Learning to See_][l2see] online would be a great acheivement. Starting this project I was always intending to do something with real-time interaction, which as an area of research essentially means creating models which are able to inference quick enough for the interaction to feel responsive. [_Learning to See_][l2see], in my mind, is a perfect example of this and is still my favourite generative deep learning project to date.

So it has been hard to shake this idea and is becoming a solid focus. After training and playing with the models mentioned above, I re-read the [Learning to See paper][l2seepaper] and was pleasantly surprised as to how simple it sounded (I remember being confused when I first read the paper 6 months ago or so). The modified _pix2pix_ model involved some pretty simple modifications, so as a first experiment I have decided to re-create the _Learning to See_ model. I am currently training a modified _pix2pix_ model as per what is advised in the [paper][l2seepaper] (minus some stuff for the sake of a speedy experiment) and after this I will try connecting it to a webcam input to see what kinds of output and at what kind of speed it can run.

After this, with getting the project online in mind, something which has interested me for a while is _model compression_. There are many examples of this but mostly in the field of classification, which is a different task to image generation. As I understand it, based on Mick's comments on the topic, a classification model can be compressed more easily as once the model has been trained it can cope with things like quantization and removing redundant space as the outcome will ultimately be a classification. So so long as the training is robust enough, loosing a chunk of the end of the floating point numbers internally will not affect the outcome so much. However a _GAN_, for example, does not explicitly know the outcome of the generative process and so methods like quantization might lead more erroneous output. The nuances in the output might well depend on the full range of a 32bit floating point number.

[p2p]: https://www.tensorflow.org/tutorials/generative/pix2pix
[cgan]: https://www.tensorflow.org/tutorials/generative/cyclegan
[l2see]: https://vimeo.com/260612034
