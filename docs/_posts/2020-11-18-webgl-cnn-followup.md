---
layout: post
title:  "WebGL CNN Followup"
date:   2020-11-18 23:48:36 +0000
categories: webgl cnn
---

The previous post on this topic was about _how_ it works and _how_ I implemented it in GLSL. I should probably talk a bit more about _why_ I did it and _why_ it might be useful in the future. But first, a little more _how_...

> TL;DR: It turns out not to be as ground-breakingly fast as I hoped it would be.

## Overview

The WebGL CNN is essentially an [_all convolutional net_][all_cnn] which is a CNN which omits the use of max-/avg-pooling by taking advantage of the fact that you can deliberately scale an input tensor (read: image) with careful selection of kernel size and stride. A simple case being a kernel size of `4x4` and a stride of `2` will halve the image in `x` and `y`.

Pooling layers are a _lossy compression_; a `2x2` max-pool just throws away 75% of the data. A strided convolution at least "sees" all the data and it is included in the downsampling. I haven't read up enough to know for sure if this is good or not, but intuitively it seems better than just chucking data away.

The image below shows a simple example, all filters are `4x4` with a stride of `2`.

	- Input: 32x32x3 image (webcam)
	- Conv2D Downsample: 64 filters
	- Conv2D Downsample: 256 filters
	- Conv2D Upsample: 64 filters
	- Conv2D Upsample: 3 filters
	- Output: 32x32x3 image

![WebGL CNN Sample]({{ site.baseurl }}/assets/images/webgl_followup/webgl_cnn.jpg)
{: .full-width}

I have used "standard" notation (as used in Tensorflow and PyTorch) for the tensors by including the batch-size as the first unit: `[bs]xWxHxD` where `D` is in fact the number of filters from the previous layer. I guess I was inconsistent when labelling the filters, but they're: `WxHxNcxNf` where `Nc` is the number of channels of the previous layer (or num filters), and `Nf` is the number of filters for that particular layer.

All the filters are just randomly initialised and nothing about the model is trained to do anything, hence the blurry mess of an output. _But_ at least data is evidently travelling through the model and the input correlates to the output.

The model above is equivalent to the diagram below, when visualised as 3D volumes:

{% include webgl_graph.html %}

## API

To make it felixible enough to test at different sizes a simple library had to be made. There is a single [Conv2D class](https://github.com/joshmurr/cci-webgl-cnn/blob/master/src/conv2d_class.js) which is basically boilerplate code to set up a simple shader program with the relevant [_downscale_](https://github.com/joshmurr/cci-webgl-cnn/blob/master/src/glsl/downscale_2_frag.glsl) or [_upscale_](https://github.com/joshmurr/cci-webgl-cnn/blob/master/src/glsl/upscale_frag.glsl) shader; a texture for input, the filters and the output; a framebuffer to render _into_ and then some `getter`s to get the data out.

Here is an example of the middle 2 layers of the model above:

```javascript
const DOWNSCALE = new Conv2D(gl, {...});

const DOWNSCALE_2 = new Conv2D(
  gl,
  {
    input: {
      size: DOWNSCALE.opts.output.size,
      num_channels: 1,
      texture: DOWNSCALE.output,
    },
    output: {
      size: 8,
      num_channels: 1,
    },
    filter: {
      num_channels: 1,
      num: 16,
      type: 'down',
    },
    prev: {
      num_filters: DOWNSCALE.opts.filter.num,
    },
  },
  {
    vs: BASIC_VERT,
    fs: require('./glsl/downscale_2_frag.glsl'),
  }
);

const UPSCALE = new Conv2D(
  gl,
  {
    input: {
      size: DOWNSCALE_2.opts.output.size,
      num_channels: 1,
      texture: DOWNSCALE_2.output,
    },
    output: {
      size: 16,
      num_channels: 1,
    },
    filter: {
      num_channels: 1,
      num: 8,
      type: 'up',
    },
    prev: {
      num_filters: DOWNSCALE_2.opts.filter.num,
    },
  },
  {
    vs: BASIC_VERT,
    fs: require('./glsl/upscale_frag.glsl'),
  }
);

const UPSCALE_2 = new Conv2D(gl, {...});
```

Calling `DOWNSCALE.output` gets the output texture of that layer. `filter.num` is actually the square root of how many filters there are. Given the nature of the process, working with square textures with square dimensions is very helpful - so `num: 8` actually means 64 filters in an `8x8` grid.

## OK, so... Why?!

GOOD QUESTION. This took up a good chunk of time and for most of it I was going on instinct. The idea pretty much came after looking at the stack trace of a TensorflowJS model running in the browser and seeing exactly (ish) what is happening at runtime.

![TensorflowJS Stack Trace]({{ site.baseurl}}/assets/images/webgl_followup/tfjs_stack.jpg)
{: .full-width}

To me this look pretty hectic. I think Javascript stack traces get confusing because there are so many callbacks and asyncronous functions all over the place, so the sequence doesn't always make sense when compared to the code. But you can make sense of routines which occur in chunks, the spiky stacks with _a lot_ of function calls is the model doing it's thing. 

There are [plenty](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices) of [resources](https://emscripten.org/docs/optimizing/Optimizing-WebGL.html) that [tell you](https://www.youtube.com/watch?v=rfQ8rKGTVlg) that good practice when using WebGL is to make WebGL API calls as rarely as possible. In the stack trace above you can see quite a few <span style="background-color: #ccf; border-radius:4px; padding:0 4px;">WebGL API calls</span> (in light blue). It seemed to me that this could be something of a performance bottleneck - something which favors a flexible backend (TensorflowJS).

A WebGL wrapper to handle data IO and rendering made significant improvements so perhaps replacing the _whole thing_ with a more efficient and bespoke WebGL based _thing_ would speed it up even more?

This was my thinking any way. And at first things looked promising. Looking at the stack trace of a simple example you can see that the overall system is much, _much_ simpler. Here is the equivalent to the stack trace above (a single step including model inference and rendering):

![WebGL CNN Stack Trace, Single Step]({{ site.baseurl}}/assets/images/webgl_followup/webgl_cnn_single.png)
{: .full-width}

And the whole profile recording of the model running for a few seconds or something:

![WebGL CNN Full Run]({{ site.baseurl}}/assets/images/webgl_followup/webgl_cnn_all.png)
{: .full-width}

You don't get to see what the GPU is doing with these browser profiling tools but wherever you see <strong style="background-color: #cfc; border-radius:4px; padding:0 4px;">green</strong> means the JS engine is handing over to the graphics engine. If data can be handed over and then only requested when it's needed (to render) then that should be a good thing.

## Results

The acid test was to create a model of equivalent architecture to that of the Pix2Pix generator, make sure the WebGL CNN is performing the equivalent number of calculations, and compare the running time differences...

TensorflowJS model inference time (using WebGL wrapper):

![TensofrlowJS Model Inference Time]({{ site.baseurl}}/assets/images/webgl_followup/tfjs_model_time.jpg)

WebGL CNN model inference time:

![WebGL CNN Model Inference Time]({{ site.baseurl}}/assets/images/webgl_followup/webgl_model_time.jpg)

They're the same! Give or take a few milliseconds I'm sure.. So! I don't think this is gonna make too many waves in terms of getting __big__ models running in the browser, and clearly the team behind TensorflowJS are pretty good! But I still think there are applications and uses for what I've done.

## A Proper Test

The model described right at the top is a pretty simple little autoencoder model. Similar models are often used in Autoencoder tutorials. So I implemented the equivalent model in PyTorch and trained it for a few epochs on the [Fashion-MNIST](https://github.com/zalandoresearch/fashion-mnist) dataset.

PyTorch makes the model layer and layer weights quite accessible. The trickt part is reshaping the data in a compatible format with the WebGL CNN (which of course has all data in 2D textures). I wasted a fair amount of time on silly methods, but turns out PyTorch has a very nifty function called `make_grid` which lays data out exactly as I want it.

The image below shows the helper functions I made to get the filters out the model in the right format:

![Saving Weights from PyTorch]({{ site.baseurl}}/assets/images/webgl_followup/pytorch_save_weights.png)
{: .full-width}

The weights were then saved using Numpy's `.npy` format - a [super lightweight and simple format](https://numpy.org/doc/stable/reference/generated/numpy.save.html) which contains information about the array structure in the header and then the data. It's quite straightforward to unpack this as a binary in Javascript, but I opted for [this nice simple loader](https://github.com/aplbrain/npyjs) which offers more of a catch-all solution than doing it myself. (Plus it's quite small, I hate using big hefty swiss-army-knife kinda things, which is why I often end up doing things myself...)

A similar process was done for the biases, then these could be loaded into the model quite simply as textures and passed into the shaders. And lo', marvel at the unbeliveable results:

![Autoencoder Results]({{ site.baseurl}}/assets/images/webgl_followup/autoencoder_results.png)
{: .full-width}

:thumbsup:

In all seriousness though, I _still_ don't think this is a lost cause, there are just endless hurdles to overcome:

## Hurdles

### __WebGL does not deal with negative numbers very well__

You can perform calculations with negative numbers in a shader fine, but you cannot _render_ a negative number; they get clipped at 0. So you can't render negative values into a framebuffer which is at the core of how data moves from one layer to another. Not a show stopper, but it means constantly scaling numbers to fall in the range `[0, 1]` which is GLSL's happy place. The scaling can get difficult because that means being able to _normalise_ a across all values of a texture.. which means knowing the min/max values.. which in a fragment shader isn't particularly easy as you only have access to that particular fragment. Hmm.

### __The upscaling process is fundamentally different__

AFIAK PyTorch and Tensorflow use a dilated convolution when upscaling which looks a bit like this:

![Dilated Convolution](https://raw.githubusercontent.com/vdumoulin/conv_arithmetic/master/gif/padding_strides_transposed.gif)

Technically this is called a _padded convolution_ but I find that so misleading.. the padding is on the inside? That's dilation if you ask me. This can be seen when you look at the output of the upsampling layer in the PyTorch model:

![PyTorch Autoencoder Upsample Output]({{ site.baseurl}}/assets/images/webgl_followup/layer_2.png)

Again not time to abandon this just yet, I just think that if the model was trained on the kinda of upsampling the WebGL CNN uses (fractional striding) then you would see better results.

More info [here](https://github.com/vdumoulin/conv_arithmetic), [here](https://towardsdatascience.com/intuitively-understanding-convolutions-for-deep-learning-1f6f42faee1) and [here](https://medium.com/apache-mxnet/transposed-convolutions-explained-with-ms-excel-52d13030c7e8) to help understand upscaling convolutions.

> There are more hurdles I'm sure but I can't remember them right now.

## Good Things

The potential in this system is how __readily available the data is__ and it's already set up in a __visual way__. _Everything_ is 2D, so displaying data is as easy as:

```javascript
gl.bindTexture(gl.TEXTURE_2D, LAYER.output);
gl.viewport(0, 0, 256, 256);
gl.scissor(0, 0, 256, 256);
gl.drawArrays(gl.TRIANGLES, 0, verts.length / 2);
```

Or `LAYER.filter` or whatever. The DREAM would be have this system trainable and to be able to witness it training in real time, much like [Karpathy's ConvNetJS](https://cs.stanford.edu/people/karpathy/convnetjs/), but faster! And interactive?! Perhaps you could influence the filters _while it's training_ and see how that affects the output. Even to do that once it's trained at runtime would be interesting. Bringing in some ideas developed in [Broad's Network Bending](https://terencebroad.com/research/network-bending), but in _real time_!

I don't see why this model couldn't train. It would need to be developed a lot furthur to bring in more features and operations, like ReLU, batchnormalisation, different sized filters/strides perhaps. And then backpropagation and all the gubbins needed to actually train a model of course. But not beyond the realm of possibility.

## Summary

I think it's got legs!

<script src="{{ site.baseurl }}/assets/js/comp_graph.js"></script>

[all_cnn]: https://arxiv.org/abs/1412.6806
