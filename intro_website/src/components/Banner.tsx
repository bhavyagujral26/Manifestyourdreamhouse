import React from 'react';

interface BannerProps {
  title: string;
  description?: string;
  image?: string;
  video?: string;
  model?: string;
}

const Banner: React.FC<BannerProps> = ({ title, description, image, video, model }) => {
  return (
    <div className="banner">
      <h2>{title}</h2>
      {description && <p>{description}</p>}

      {image && <img src={image} alt={title} />}
      {video && <video src={video} autoPlay muted loop />}
      {model && <model-viewer src={model} alt={title} camera-controls auto-rotate></model-viewer>}
    </div>
  );
};

export default Banner;
