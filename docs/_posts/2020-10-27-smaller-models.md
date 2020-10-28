---
layout: post
title:  "Smaller Models"
date:   2020-10-27 22:26:36 +0000
clouds_256_8: DZoluQKbzlA 
clouds_256_4: kueLxGfGhJc 
upload_model_chromium: Cid032-s1eA
flowers_256_8_RTX2070_firefox: H-wm4UtLj2s
flowers_256_8_integrated_firefox: zt_0UVxOB9E
flowers_256_8_integrated_chromium: upykMczxPGk
categories: tensorflow pix2pix javascript
---

Following up on the previous post, I tried out what probably should have been my first experiment with all this, and that is to just run a _smaller model_. By that I mean a model with far fewer parameters. As I spoke about in the previous post, most of the parameters in the _pix2pix_ model are centered around the middle layer of the model, so reducing the number a layers does not do much to reduce the size, but by reducing the number of _filters_ each `conv2D` layer trains on can significantly reduce it's size. As it turns out you can still get a pretty decent model out of it too! But I'll come back to that shortly.

The initial `conv2D` layer in the original _pix2pix_ model starts with 64 filters in the first layer of the generator (the encoder half), and then proceeds to double the number of filters maxing out at 512. At the middle layer the model then begins to _decode_ and halves the number of filters down to 64 again, mirroring the encoder half. This results in __<u>52,476,931</u> total parameters__. We can scales those numbers down by a reasonable order of magnitude resulting in the following structure:

![New Pix2Pix Comp Graph]({{ site.baseurl }}/assets/images/smaller_model/pix2pix_smaller_comp_graph.png)

Excuse my bad mouse-handwriting and the fact I just mirrored the top half for the bottom... But you can see visually that the number of parameters is greatly reduced compared to the original. This model starts with jutst 8 filters at the first layer and then follows the same pattern as before: double each layer up to 512 filters and then halving back to 8. This results in __<u>16,786,211</u> total parameters__ thus __shrinking the model by approximately a third__. This speeds the performance of the model up in the browser significantly and also shows off the benefit of the WebGL based output. The average (rough) FPS output using the TensorflowJS `toPixels()` method is around __20fps__, while the average (rough) FPS when output via WebGL is around __28fps__, sometimes reaching __35fps__.

## Demos

The flowers model below is trained on the [102 Category Flower Dataset](https://www.robots.ox.ac.uk/~vgg/data/flowers/102/index.html) provided by Oxford University which is a collection of 1000 images of 102 types of flower. The split is 4:1 with training:testing data (although there isn't exactly much testing, it may as well all be training data), buffer size of 900 and batch size of 4.

<u>Flowers on RTX2070 Graphics Card in Chromium ↓</u>

{% include youtubePlayer.html id=page.flowers_256_8_RTX2070_firefox %}

<u>Flowers on Integrated Graphics Card in Firefox ↓</u>

What is quite cool here is that the model _actually runs_ on an integrated graphics card, pretty much to the same performance of the full model and in older demos. Output via WebGL almost double the framerate from approx __10fps__ to upto __20fps__.

{% include youtubePlayer.html id=page.flowers_256_8_integrated_firefox %}

<u>Flowers on Integrated Graphics Card in Chromium ↓</u>

Running the same thing in Chromium does not yield the same results, in fact shows little difference when switching to WebGL output.. Not sure why yet because Chromium was much fast that Firefox in the first demo above.

{% include youtubePlayer.html id=page.flowers_256_8_integrated_chromium %}

<u>Clouds on RTX2070 Graphics Card in Firefox ↓</u>

This model was trained on stills from [this timelapse video](https://www.youtube.com/watch?v=232LFz) using the `frame_extractor` sript from my [Auto-Pix2Pix](https://github.com/joshmurr/cci-auto-pix2pix/) tool. This is trained on around 600 very similar images. The result is still decent, but naturally lacks variety.

{% include youtubePlayer.html id=page.clouds_256_8 %}

And this model below is even smaller again. The first `conv2D` layer has 4 filters and then follows the same pattern as above. This results in __<u>6,297,491</u> total parameters__, so a much smaller model again but this does not result in another performance boost and does show a much weaker model.

{% include youtubePlayer.html id=page.clouds_256_4 %}

As a first guess, I imagine this reaches the bottleneck of just running the model using TensorflowJS. The things taking the most time in this instance may well be all the WebGL API calls and just moving data around, rather than the computation itself - but that's just a guess for now.

<u>And here is a video of the model upload process on Chromium ↓</u>

{% include youtubePlayer.html id=page.upload_model_chromium %}

## What Next

Now, given I have a smaller model size which performs much better in the browser and also performs _well enough_ to get some meaningful interaction, I should probably package that up into a simpler web app which can be sent around and tested on many more machines with varying capabilities. What I often find is that something works fine on my laptop in my home, but tends to fall to bits when someone else touches it. So some _actual user testing_ should happen soon.

But actually what I'm noticing is that TensorflowJS is providing the speed-bumps here. TensorflowJS is phenomenal I must say; the fact that it can be _so_ multipurpose and function exceptionally well in most cases is a great achievement. But as is the case with most large libraries, there has been a sacrifice of speed for flexibility. The internal nuts and bolts use WebGL and shader programs to run the computation but it is frequently taking data out of the WebGL pipeline to do some TensorflowJS manipulation and then giving it back to WebGL which is always going to be slow. _What if that process was streamlined, and made more specific to the task at hand?_

Well, I've already spent 3 weeks of my life trying to answer that question while panicking that I'm out of my depth and I'm wasting my time. BUT! I think I actually have something (theoretically) cool which at least proves a point. TBC...
