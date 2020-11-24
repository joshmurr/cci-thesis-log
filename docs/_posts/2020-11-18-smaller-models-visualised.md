---
layout: post
title:  "Smaller Models Visualised using CSS"
date:   2020-11-18 20:08:36 +0000
categories: css tensors
---

The smaller model structure became breakthrough of getting _Learning to See_ [online][lts] and functional. While developing the [WebGL CNN][webglcnn] I was constantly drawing representations of models and I really found the value in the diagrams you commonly see in ML papers:

![Google Visualisation](https://1.bp.blogspot.com/-sZkqU-oe8Tg/X5s7bLt_7fI/AAAAAAAAGwA/J4gINsbIQO4_ElyD5fMB25awZnFC5yeowCLcBGAsYHQ/s16000/image10%2B%25281%2529.jpg)

![Sketchbook]({{ site.baseurl }}/assets/images/css_graphs/sketch.jpg)

> _Source:_ [Background Features in Google Meet, Powered by Web ML](https://ai.googleblog.com/2020/10/background-features-in-google-meet.html)

Thus I felt visualising the size of the model itself is a valuable thing to do to help gain an intuition of how hefty the model it is, and what this will ultimately mean for performance (in all senses of the word: ability to generalise, liklihood of overfitting, size in memory, inference running time, etc.).

Below is the original Pix2Pix model, to scale, and then the two other sizes which are on the [Learning to Learn to See][lts] web app, each being _Large_, _Medium_ and _Small_ respectively.

I've gone for a slightly unconventional flattened-[TIE-Fighter](https://en.wikipedia.org/wiki/TIE_fighter) layout (the convention being the image above), but to keep things to scale, in perspective _and_ all on screen at once this was the best solution. With the layout above, the middle layers would be really wide and make the overall graph too big.

> Turns out that much 3D CSS can be quite a lot for the browser to handle! I've removed the back and bottom faces as you don't actually see them, and turned off animations if there are more than one on the page, but don't be surprised if this page is a bit slow. I'll worry about it a bit more another time.

{% if jekyll.environment == "printing" %}
![Large Graph]({{ site.baseurl }}/assets/images/css_graphs/big_graph.png)
{: .full-width}
> If you're reading the PDF, you'll see screenshots rather than rendered CSS.

![Medium Graph]({{ site.baseurl }}/assets/images/css_graphs/med_graph.png)
{: .full-width}

![Small Graph]({{ site.baseurl }}/assets/images/css_graphs/small_graph.png)
{: .full-width}
{% else %}
{% include big_graph.html %}

{% include medium_graph.html %}

{% include small_graph.html %}
{% endif %}



[lts]: https://learning-to-learn-to-see.netlify.app/
[webglcnn]: https://github.com/joshmurr/cci-webgl-cnn

<script src="{{ site.baseurl }}/assets/js/comp_graph.js"></script>
