---
layout: post
title:  "Using Jupyter Notebook with Docker Containers"
date:   2020-08-15 12:45:36 +0100
categories: docker jupyter tensorflow
---

I am conviced using Docker conatiners for Tensorflow development is the way to go but it doesn't come without some fiddly configuration gotchas which can be confusing. 

To run the container with Jupyter:
```bash
sudo docker run -td -p 3000:8888 -v /$(pwd):/tf -w /tf tensorflow/tensorflow:latest-gpu-jupyter
```

The `-td` flag will run the container in the background - this allows you to run `docker exec` commands which you couldn't do with an interactive shell as Jupyter would be hogging the shell with all it's logs.

To get the ID of the running container:

```bash
sudo docker ps
```

The ID will be something like `9e44b7456795` in the `NAMES` column. With that ID you can now run:

```bash
sudo docker exec 9e44b7456795 jupyter notebook list
```

We chose a container specifically with Jupter when we chose `tensorflow/tensorflow:latest-gpu-jupyter` which spins up Jupyter Notebook for us. The output of the command above you should be given a link to the running Jupyter server. But we also changed the local port when we specified `-p 3000:8888` which you will need to change in the link, so the link when your notebooks can be found will be something like:

```
http://0.0.0.0:3000/?token=e30336427dbc72050b11704ab2e95a77d8b54f73ae1a7a9a
```

The container comes pre-installed with most useful Python packaged, but if you come across one you need to install you do that like so:

```bash
sudo docker exec 9e44b7456795 pip install <package name>
```

I have had to install `tensorflow-datasets` this way. These will _not persist_ so if you end the notbook and reopen you will need to reinstall. The workaround for this is to create your own Dockerfile or use Docker-Compose but I'm sure I'll get more into that later on.

If you do want to see the Jupyter logs, which can be handy to make sure the file is saving correctly and things like this (I created a whole notebook which was 'Untrusted' and so I couldn't save any of it).. You can run:

```bash
sudo docker logs 9e44b7456795
```
