---
layout: post
title:  "Smaller Models Visualised using CSS"
date:   2020-11-18 20:08:36 +0000
categories: css tensors
---

The [smaller model structure]({% link _posts/2020-10-27-smaller-models.md %}) became breakthrough of getting _Learning to See_ [online][lts] and functional. While developing the [WebGL CNN][webglcnn] I was constantly drawing representations of models and I really found the value in the diagrams you commonly see in ML papers:

![Google Visualisation](https://1.bp.blogspot.com/-sZkqU-oe8Tg/X5s7bLt_7fI/AAAAAAAAGwA/J4gINsbIQO4_ElyD5fMB25awZnFC5yeowCLcBGAsYHQ/s16000/image10%2B%25281%2529.jpg)

![Sketchbook]({{ site.baseurl }}/assets/images/css_graphs/sketch.jpg)

> _Source:_ [Background Features in Google Meet, Powered by Web ML](https://ai.googleblog.com/2020/10/background-features-in-google-meet.html)

Thus I felt visualising the size of the model itself is a valuable thing to do to help gain an intuition of how hefty the model it is, and what this will ultimately mean for performance (in all senses of the word: ability to generalise, liklihood of overfitting, size in memory, inference running time, etc.).

Below is the original Pix2Pix model, to scale, and then the two other sizes which are on the [Learning to Learn to See][lts] web app, each being _Large_, _Medium_ and _Small_ respectively.

I've gone for a slightly unconventional flattened-[TIE-Fighter](https://en.wikipedia.org/wiki/TIE_fighter) layout (the convention being the image above), but to keep things to scale, in perspective _and_ all on screen at once this was the best solution. With the layout above, the middle layers would be really wide and make the overall graph too big.

> Turns out that much 3D CSS is a bit too much to handle and the browser starts to struggle. Ironic really, given the nature of the project. I'm not gonna stress about it right now, but I'm sure it'll bug me enough to eventually make it more performant.. Any way, these are just screenshots for now!

![Large and Medium Graphs]({{ site.baseurl }}/assets/images/css_graphs/graphs_1.png)
{: .full-width}
![Small Graph]({{ site.baseurl }}/assets/images/css_graphs/graphs_2.png)
{: .full-width}

[lts]: https://learning-to-learn-to-see.netlify.app/
[webglcnn]: https://github.com/joshmurr/cci-webgl-cnn
