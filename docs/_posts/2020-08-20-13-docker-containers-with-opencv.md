---
layout: post
title:  "Docker Containers with OpenCV"
date:   2020-08-20 16:33:36 +0100
categories: docker opencv python
---

This was the biggest headache yet. It's taken me 3 days, maybe longer, to get OpenCV to open a video file and display it in a Docker container. It turns out it's such a headache because OpenCV sits on top of a fairly sophisticated C++ library which needs access to a whole load of dependancies installed on the machine. But finding out exactly what is missing from a Docker image can be tricky. I wont go into too much detail, but just so it's documented somehere for now, this is the Dockerfile which got things working:

```
FROM tensorflow/tensorflow:latest-gpu-jupyter

WORKDIR /tf

COPY . /tf

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install git cmake wget unzip ffmpeg libsm6 -y

ADD opencv.sh /home/opencv.sh
RUN /home/opencv.sh
RUN pip install Cython
RUN pip install contextlib2
RUN pip install pillow
RUN pip install lxml
RUN pip install opencv-contrib-python
```

And this is the `opencv.sh` script. All this is based on [this post](https://amin-ahmadi.com/2020/03/07/computer-vision-docker-image-with-tensorflow-and-opencv/) by the way, I removed the Tensorflow installation script and based my image on the `Tensorflow/Tensorflow:latest-gpu-jupyter` image from Tensorflow.

```
cd /
git clone https://github.com/opencv/opencv.git --single-branch 3.4.9
mv 3.4.9 cv
cd cv
mkdir build
cd build
cmake ..
make
make install
```

__libsm6__ and __opencv-contrib-python__ were the dependancies which took me the longest to track down (as missing deps). I also spent a long time using a short Python script to test things which was actually useless, so that didn't help.

Providing you're in the folder that you want linked to the container image, it is not necessary to provide a [bind mount](https://docs.docker.com/storage/bind-mounts/) for your app directory on the host machine. There are a few things which need to be in the `run` command however:

```
sudo docker run -td --rm --env="DISPLAY" --volume="/tmp/.X11-unix:/tmp/.X11-unix:rw" --env="QT_X11_NO_MITSHM=1" -v $(pwd):/tf --gpus all -ti lts:latest
```

`--env="DISPLAY"` tells the container which display to use.

`--volume="/tmp/.X11-unix:/tmp/.X11-unix:rw"` gives the container access to the host machines X11 files so that it can open up windows.

`--env="QT_X11_NO_MITSHM=1"` I'm not sure what this does and it might not actually be necessary...

`-v $(pwd):/tf` this gives the container access to the files currently in $(pwd) (despite what I said earlier).
