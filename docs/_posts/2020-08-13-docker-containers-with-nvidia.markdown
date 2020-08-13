---
layout: post
title:  "Running Docker Containers with Nvidia GPU Access on Ubuntu"
date:   2020-08-13 13:26:36 +0100
categories: docker nvidia
---

This is a pretty specific guide for anyone who may use the _CCI GFX PC_ after me. After creating a new user account on the machine I had to go through some set up before I could run ML models using the Nvidia Quadro RTX 6000 graphics card.

Most of what you need is already installed on the machine, and as I understand it a correctly implement Docker container will do most of the work for you in terms of accessing the right drivers and CUDA toolkit etc. However you will need to install Docker as a new user and set that up correctly in the first place.

If Docker is not already installed, install that. I wont put exactly how I did it here because I can't remember how I did it. But something like `sudo apt install docker`.

Followthe _Quickstart_ instructions [here](https://github.com/NVIDIA/nvidia-docker). The line `sudo systemctl restart docker` will likely not work, so run:

```
$ sudo apt install docker.io
$ sudo systemctl restart docker
```

Docker should now be set up. However to run `nvidia/cuda` containers, you need to specify the runtime. This command just prints the details of the graphics card, but from _inside_ the container, so if this works you should be all good:

```
$ sudo docker run --gpus all --rm nvidia/cud:9.0-runtime nvidia/smi
```

You can now run some more involved ML models, such as the [GAN-Explorer](https://github.com/previtus/GAN_explorer) which has a Docker command like so:

```
$ sudo docker run -it --rm --user=$(id -u $USER):$(id -g $USER) --env="DISPLAY" --volume="/tmp/.X11-unix:/tmp/.X11-unix:rw" --env="QT_X11_NO_MITSHM=1" --gpus all -ti previtus/demo-gan-explorer
```


