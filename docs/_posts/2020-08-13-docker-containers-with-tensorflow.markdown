---
layout: post
title:  "Running Docker Containers with Tensorflow on Ubuntu"
date:   2020-08-13 13:26:36 +0100
categories: docker nvidia
---

This is a pretty specific guide for anyone who may use the _CCI GFX PC_ after me. After creating a new user account on the machine I had to go through some set up before I could run ML models using the Nvidia Quadro RTX 6000 graphics card.

Most of what you need is already installed on the machine, and as I understand it a correctly implement Docker container will do most of the work for you in terms of accessing the right drivers and CUDA toolkit etc. However you will need to install Docker as a new user and set that up correctly in the first place.

If Docker is not already installed, install that. I ended up completely uninstalling anything to do with Docker as I found that Docker-Compose was installed using Snap, which I read somewhere is not recommended by Docker. So I followed the official instructions [here](https://docs.docker.com/engine/install/ubuntu/).

Then follow the Nvidia-Docker _Quickstart_ instructions [here](https://github.com/NVIDIA/nvidia-docker). The line `sudo systemctl restart docker` will likely not work, so run:

```
$ sudo apt install docker.io
$ sudo systemctl restart docker
```

Docker should now be set up. However to run `nvidia/cuda` containers (as is one of the preliminary test containers on the Tensorflow Docker guide), you need to specify the runtime. This command just prints the details of the graphics card, but from _inside_ the container, so if this works you should be all good:

```
$ sudo docker run --gpus all --rm nvidia/cuda:9.0-runtime nvidia/smi
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

---

### Dockerfile and Docker Compose

You can then use Docker-Compose to make the `run` command a bit more concise. For example, to build a simple Tensorflow image with a custom startup script create a `Dockerfile` as follows:

```YAML
FROM tensorflow/tensorflow
WORKDIR /<root directory of app>
COPY . .
CMD ["bash"]
```

This will allow you to run `$ docker build -t tf-cpu .` which will create a Docker image on your machine, running `$ docker images` should show the image named `tf-cpu` (this is actually called a _tag_ and you can tag it whatever you want). You can then run this image with:

```bash
$ sudo docker run -it --rm -v /home/josh/thesis/tf-docker:/tmp -w /tmp tf-cpu
```

Notice the newly created image as the last argument. However to make this even more concise we can use Docker-Compose. Create an accompanying `docker-compose.yml` file:

```YAML
version: "3.8"
services:
  tf-cpu:
    image: tensorflow/tensorflow
    command: bash
    working_dir: /<name of root folder>
    volumes:
      - ./:/<path to root folder, or desired volume location on host machine (I just use the root, same as above)>
```

This allows us to put the working directory and the volumes in a file which were previously passed as `-w` and `-v` flags in the above command line argument. Now we can run our container using `docker-compose`:

```bash
$ docker-compose run tf-cpu
```

`tf-cpu` is the name of the _service_ declared in `docker-compose.yml`, and we need to use `docker-compose run` to get an interactive container, whereas you will most often see `docker-compose up ...` online.

I've spent some time playing around with Docker which will hopefully mean making projects which can take advantage of these premade images a lot easier and hopefully it will help someone out in the future too.

