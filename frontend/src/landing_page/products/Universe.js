import React from 'react';

function Universe() {
  const imageStyle = {
    width: "200px",
    height: "200px",
    objectFit: "contain",
    objectPosition: "center"
  };

  return (
    <div className="container mt-5">
      <div className="row text-center">
        <h2 className='mt-5 mb-4'>The Zerodha Universe</h2>
        <p>Extend your trading and investment experience even further with our partner platforms</p>
        <div className="col-4 p-3 mt-5">
          <img src="images/smallcaseLogo.png" style={imageStyle} alt="Smallcase" />
          <p className='text-small text-muted'>Thematic investing platform</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img src="images/streakLogo.png" style={imageStyle} alt="Streak" />
          <p className='text-small text-muted'>Algo & strategy platform</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img src="images/sensibullLogo.svg" style={imageStyle} alt="Sensibull" />
          <p className='text-small text-muted'>Options trading platform</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img src="images/zerodhaFundhouse.png" style={imageStyle} alt="Zerodha Fund House" />
          <p className='text-small text-muted'>Asset management </p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img src="images/goldenpiLogo.png" style={imageStyle} alt="Goldenpi" />
          <p className='text-small text-muted'>Bonds trading platform</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img src="images/dittoLogo.png" style={imageStyle} alt="Ditto" />
          <p className='text-small text-muted'>Insurance</p>
        </div>
        <button className='p-2 btn btn-primary fs-5 mb-5 mt-5' style={{width:"17%",margin:"0 auto"}}>Sign up for free</button>
      </div>
    </div>
  );
}

export default Universe;