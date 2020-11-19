---
layout: post
title:  "Learning to Learn to See"
date:   2020-09-03 18:51:36 +0100
lts_vimeoID: 260612034
categories: tensorflow pix2pix python
---

_Learning to See_ by Memo Akten has always been one of my favourite pieces of artworks from the world of machine learning. It shows the inner workings of a generative model in a simple and responsive way. It was definitely the highlight for me seeing it at the AI exhibition at the Barbican a few years ago. Mick floated the idea that it would be pretty cool to get a recreation or an equivalent of _Learning to See_ working in the browser so it could exist online.. so I couldn't resist giving it ago!

{% include vimeoPlayer.html id=page.lts_vimeoID %}

_Learning to See_ is based the the [pix2pix][p2p] model which is an image-to-image translation model which trains on pairs of images, learning to translate one input image into a desired output. It has proven itself to be very flexible and has been used in many applications:

![pix2pix Applications](https://phillipi.github.io/pix2pix/images/teaser_v3.jpg)
{: .full-width}

The architecture of the _pix2pix_ model is very well described by [Christopher Hesse](https://twitter.com/christophrhesse) [here](https://affinelayer.com/pix2pix/) and he also produced this block diagram of the model (here depicting an image-colourisation application of the model):

![pix2pix Block Diagram]({{site.baseurl}}/assets/images/lts/pix2pix_block_diagram.png)

Given the broad uses of the model it is very well documented online and the official [Tensorflow write-up](https://www.tensorflow.org/tutorials/generative/pix2pix) is very good. So that's where I started. This is the 'hello world' output of the model - translating coloured blocks into building facades:

![Facades]({{site.baseurl}}/assets/images/lts/pix2pix_building.png)
{: .full-width}

The [paper][lts-paper] which accompanies the artworks reveals the details of how their particular model was trained:

> The traditional pix2pix requires corresponding (input, target) image pairs. With our method, we only provide target images.

So effectively the input image is generated on the fly based on the target image from the dataset. The preprocessing pipeline is described:

- scale target image to a random size between 100% and 130% of the desired image size
- take random crop of the desired size
- depending on the nature of the dataset, randomly flip horizontally and/or vertically
- convert to grayscale
- downscale 24x with area filtering, upscale back to original size with cubic filtering
- apply random brightness of up to ±20%
- apply random contrast of up to ±15%

After working through the Tensorflow implementation of the model this seemed simple enough! I got hold of a [dataset of flowers](http://www.robots.ox.ac.uk/~vgg/data/flowers/102/index.html) kindly made free by Oxford University (I think) and had a quick crack at creating the same preprocessing pipeline.

![Facades]({{site.baseurl}}/assets/images/lts/image_pairing.png)

One thing I didn't do was the full conversion to greyscale from colour which is described in the paper. I didn't do this because I couldn't quickly work out how to adjust the model to take a different shaped tensor (a single channel image rather than 3) as an input. That is a fundamental change in the architecture of the first few layers of the generator which didn't seem like a quick change (I wanted to see it do stuff!). So instead I desaturated the image but kept the 3 channels - I think this led to worse results than the paper but I'll come back to that.

I initially trained this on a dataset of 800 images, with a batch size of 4 for 100 epochs. And then trained the same model for a futher 150 epochs. So results of the training process are shown below:

![1 Epoch]({{site.baseurl}}/assets/images/lts/1_epoch_screenshot.png)
![3 Epochs]({{site.baseurl}}/assets/images/lts/3_epochs.png)
![50 Epochs]({{site.baseurl}}/assets/images/lts/50_epochs.png)
![250 Epochs]({{site.baseurl}}/assets/images/lts/250_epochs.png)

The last image is the fully trained model, and I thought the output was rather handsome. All input and output images are 256x256x3.

After this is was actually fairly simple to process video in the same way and run the frames of the video through the model. The batch of images are without preprocessing and the latter are with preprocessing:

![Webcam no Preprocessing]({{site.baseurl}}/assets/images/lts/v1_webcam.png)
{: .full-width}
![Webcam with Preprocessing]({{site.baseurl}}/assets/images/lts/v1_webcam_preprocess.png)
{: .full-width}

The outcome was a little disappointing. The output from the actual _Learning to See_ model seems to be able to react to forms a lot more deliberately to produce forms which are recognisable as waves, or nebulae, or flowers; whereas mine makes flower-y colours/shapes/textures but struggles to make __a flower__.

![LTS Paper Example]({{site.baseurl}}/assets/images/lts/paper_flowers.png)
{: .full-width}

This could be down to a lot of things:

- The dataset I used is almost entirely close-up images of flowers. This means the model is never going to create an assemblage of flowers as an output.
- The preprocessing perhaps doesn't abstract the image enough. You can see in the original paper the input images are very soft whereas mine are still a bit edgey.
- My choosing to desaturate the image rather than greyscale it might also be an issue. You can also see in the paper the input images have strong contrast; a definite range from black to white. Mine are just pretty grey. I did think at the time this could work in my favour as webcam input tends to be pretty grey and desaturated given the quality and resolution of the camera, but the input is going to be preprocessed any way so I should probably take that moment to create the stronger contrast in the input.
- My model is based on the [Tensorflow implementation](https://www.tensorflow.org/tutorials/generative/pix2pix) which uses a [U-Net architecture](https://en.wikipedia.org/wiki/U-Net) for the generator as I believe it is easier to implement. The actual [pix2pix][p2p] model uses a [ResNet](https://en.wikipedia.org/wiki/Residual_neural_network) (or Residual Neural Network) - they both serve similar purposes but who knows maybe that would change things. It doesn't specify in the _Learning to See_ [paper][lts-paper] which one they used.

In all it was a great exercise and got the ball rolling for me. I have since tried some other things and have more to write about but I'm going to leave this here for now...


<!-- IMAGES -->
[p2p]: https://phillipi.github.io/pix2pix/
[lts-paper]: https://arxiv.org/ftp/arxiv/papers/2003/2003.00902.pdf
