---
layout: post
title:  "Running Docker Containers with Nvidia GPU Access on Ubuntu"
date:   2020-08-13 13:26:36 +0100
categories: docker nvidia
---

This is a pretty specific guide for anyone who may use the _CCI GFX PC_ after me. After creating a new user account on the machine I had to go through some set up before I could run ML models using the Nvidia Quadro RTX 6000 graphics card.

Most of what you need is already installed on the machine, and as I understand it a correctly implement Docker container will do most of the work for you in terms of accessing the right drivers and CUDA toolkit etc. However you will need to install Docker as a new user and set that up correctly in the first place.

If Docker is not already installed, install that. I wont put exactly how I did it here because I can't remember how I did it. But something like `sudo apt install docker`.

Follow the _Quickstart_ instructions [here](https://github.com/NVIDIA/nvidia-docker). The line `sudo systemctl restart docker` will likely not work, so run:

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

Working with Tensorflow Docker conatiners is proving to be very useful. I just ran some small scale tests using an example MNIST classification model from the [Tensorflow website](https://www.tensorflow.org/tutorials/quickstart/advanced). Containers keeps things very simple, you don't need to worry about `pip install`-ing anything, you just write your python code using Tensorflow as you would normally, spin up a Tensorflow container and just run your script from inside the container. This allowed me to run the same script on the CPU and then on the GPU just by changing container.

To run on the CPU:

```
$ sudo docker run -it --rm -v /home/josh/thesis/tf-docker:/tmp -w /tmp tensorflow/tensorflow python script.py
```

And on the GPU:

```
sudo docker run --gpus all -it --rm -v /home/josh/thesis/tf-docker:/tmp -w /tmp tensorflow/tensorflow:latest-gpu python script.py
```

Each test took 71.74s and 11.23s respectively.
