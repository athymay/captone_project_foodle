function Image({ src }: { src: string }) {
  return (
    <div
      style={{
        width: '100%',
        height: 'calc(100% - 30px)',
        marginTop: '20px',
        objectFit: 'cover',
      }}
    >
      <img alt="" src={src} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

export default Image;
