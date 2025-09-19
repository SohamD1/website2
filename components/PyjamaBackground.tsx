const PyjamaBackground = () => {
  return (
    <div
      className="pyjama-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        backgroundColor: '#000000',
        backgroundImage: `
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 20px,
            rgba(255, 255, 255, 0.02) 20px,
            rgba(255, 255, 255, 0.02) 40px
          ),
          repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 20px,
            rgba(255, 255, 255, 0.015) 20px,
            rgba(255, 255, 255, 0.015) 40px
          )
        `
      }}
    />
  )
}

export default PyjamaBackground