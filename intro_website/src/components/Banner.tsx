interface BannerProps {
  title: string;
  description?: string;
  image?: string;
  video?: string;
  model?: string;
}

const Banner = ({ title, description, image, video, model }: BannerProps) => {
  return (
    <div className="banner">
      <h2>{title}</h2>
      {description && <p>{description}</p>}

      {image && <img src={image} alt={title} />}
      {video && <video src={video} autoPlay muted loop />}
      {model && (
        <div
          dangerouslySetInnerHTML={{
            __html: `<model-viewer src="${model}" alt="${title}" camera-controls auto-rotate></model-viewer>`
          }}
        />
      )}
    </div>
  );
};

export default Banner;
