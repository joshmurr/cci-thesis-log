---
layout: post
title:  "Auto Pix2Pix"
date:   2020-09-15 13:26:36 +0100
categories: tensorflow python colab
---

[Auto Pix2Pix][ap2p] was created because I had to give back the souped up CCI GFX PC and so all the model training had to move on to Google Colab. It's a pain getting data into and out of a Colab session: you have limited space, if it's inactive for too long your session ends and you lose all your work, its slow to upload large datasets to. The workaround I found for most of these issues is to write Bash or Python scripts to take care of as much as possible.

The Git repository can be cloned into a Colab session like you would normally, just prepending arguments with a `!` tells Colab to run the line as a commandline argument.

## Creating a Dataset

Creating datasets from timelapse videos taken from YouTube has proven to be a very quick way to get a dataset of similar images together. There is a `downloads.sh` script to download the necessary programs ([Youtube-DL][ydl], [BC][bc] and [ImageMagick][immag]) and create the directory structure needed.

Once a video is downloaded, the `frame_extractor.sh` script can be run, which uses [FFMPEG][ffmpeg] to do most of the heavy lifting.  The script is called like so:

```bash
sudo chmod u+x frame_extractor.sh
frame_extractor.sh [VIDEO] [DATASET DIRECTORY] [NUM IMAGES TO EXTRACT] [IMAGE SCALING]
```

The script divides the lengh of the video by `[NUM IMAGES TO EXTRACT]` to get a time interval and proceeds to extract at each time step. The frame cropped is a square image according to `[IMAGE SCALING]` which would be something like `-1:256` which scales the height to `256` while maintaining aspect ratio. A crop from either side is taken like so:

{% include image_cropping.html %}

This is to try and get as much out of a video as possible, if the video is quite long this might not be necessary and [an alternative script is found here][alt].

Bash scripts can get quite messy quite quickly, but the main loop is as follows:

```bash
while [[ $i -le $NUM_FRAMES ]]
  do
    # Move forward to the right timestamp
    seek_to=$(date -d@"$secs" -u +%H:%M:%S.%3N)
    
    # Create image output name
    newname=$(printf "image_%05d.jpg" "$i")
    
    # Save full frame as a temporary image in /tmp
    ffmpeg -y -hide_banner -loglevel warning -accurate_seek -ss "$seek_to"\
      -i "$FILE" -frames:v 1 -vf scale="$SCALE" ${TMP}
    
    # Take LEFT crop from tmp image
    ffmpeg -y -hide_banner -loglevel warning -i ${TMP} -vf "crop=iw-${diff}:ih:0:0" "$OUTPUT_DIR/$newname"
    let i=i+1
    
    # Change output name again
    newname=$(printf "image_%05d.jpg" "$i")
    
    # Take RIGHT crop from tmp image
    ffmpeg -y -hide_banner -loglevel warning -i ${TMP} -vf "crop=iw-${diff}:ih:${diff}:0" "$OUTPUT_DIR/$newname"
    let i=i+1
    
    # Increase timestamp by $interval using bc for floating point maths
    secs=$(bc <<< "$secs + $interval")
  done
```

The [full script can be seen here](https://github.com/joshmurr/cci-auto-pix2pix/blob/master/frame_extractor.sh).

## The Model

First the Tensorflow implementation of the Pix2Pix model I have been using was [turned into a class](https://github.com/joshmurr/cci-auto-pix2pix/blob/master/model.py) which can take a number of arguments when instantiated. This was quite early days really so one thing I worked into the model with the ability to strip layers away from either end (like peeling layers of an onion) but it was later found that this makes little difference to performance and just reduces the quality of the model (written about it more detail in later posts).

The model is called like so:

```bash
python3 main.py -d [DATASET PATH] -n [NAME OF MODEl] -e [EPOCHS]
```

## Full Automation

A [script to fully automate the process][automate] was created to put all of this together: downloading requirements, downloading video, extracting frames, creating file structure, setting model/training options and then training the model. It is an interactive Bash script which, when run in Colab, provides the user with a number of input boxes to input options as it goes.

Personally I preferred the former option as I ended up needing more control throughout the process and to visually inspect the downloads before training. But as a method this makes using Colab a lot nicer; I consistently used the `frame_extractor.sh` script for all models later in the project and when fine tuned the process could become very slick.

Creating a model class with many parameters is commonplace in the [research](https://github.com/junyanz/pytorch-CycleGAN-and-pix2pix) I was [looking at](https://github.com/mit-han-lab/gan-compression) and seems to be the way to go in research in order to iterate over the training process while making changes at each iteration.



[ap2p]: https://github.com/joshmurr/cci-auto-pix2pix
[ydl]: https://youtube-dl.org/
[ffmpeg]: https://ffmpeg.org/
[bc]: https://en.wikipedia.org/wiki/Bc_(programming_language)
[immag]: https://imagemagick.org/index.php
[alt]: https://gist.github.com/joshmurr/5ed7a24bad8c9e306cd908b3eb3fcd50
[automate]: https://github.com/joshmurr/cci-auto-pix2pix/blob/master/automate.sh
