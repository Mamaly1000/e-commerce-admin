"use client";
import React, { FC, useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import { toast } from "react-toastify";
import placeholder from "../../../public/images/placeholder-removebg-preview.png";
interface ImageUploadStore {
  value?: string[];
  disabled?: boolean;
  onChange: (val: string) => void;
  onRemove: (val: string) => void;
  max?: number;
}
const ImageUpload: FC<ImageUploadStore> = ({
  onChange,
  onRemove,
  disabled,
  value = [],
  max = 1,
}) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <div className=" gap-4 mb-4  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  ">
        {value.map((url) => {
          let image = url;
          return (
            <div
              key={url}
              className="relative overflow-hidden drop-shadow-2xl rounded-md aspect-video"
            >
              <div className="z-10 absolute top-2 right-2">
                <Button
                  variant={"destructive"}
                  size={"icon"}
                  type="button"
                  onClick={() => onRemove(url)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
              <Image
                src={!!image ? image : placeholder.src}
                alt="image"
                fill
                onError={() => {
                  image = placeholder.src;
                }}
                className="object-cover relative z-0"
              />
            </div>
          );
        })}
      </div>
      <CldUploadWidget
        uploadPreset="ecommerce-admin-presets"
        onError={(error) => {
          console.log(error);
          toast.error("something went wrong!");
        }}
        onSuccess={(res) => {
          onUpload(res);
          toast.success("Image uploaded.");
        }}
        options={{
          maxFiles: max,
        }}
      >
        {({ open }) => {
          const onClick = () => open!();
          return (
            <Button
              variant={"secondary"}
              onClick={onClick}
              disabled={disabled}
              type="button"
            >
              <ImagePlus className="w-4 h-4 mr-2" />
              upload image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
