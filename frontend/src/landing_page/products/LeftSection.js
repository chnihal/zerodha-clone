import React from "react";

function LeftSection({
  imageURL,
  productName,
  productDescription,
  tryDemo,
  learnMore,
  googlePlay,
  appStore,
}) {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-7 p-5 ">
          <img src={imageURL} alt={productName} className="img-fluid" />
        </div>
        <div className="col-5 mt-5 p-5">
          <h3>{productName}</h3>
          <p>{productDescription}</p>
          <div>
            <a href={tryDemo} style={{textDecoration: 'none' }}>Try Demo→</a>
            <a href={learnMore} style={{ marginLeft: '50px', textDecoration: 'none' }}>Learn More→</a>
          </div>
          <div className="mt-4">
            <a href={googlePlay}><img src="images/googleplaybadge.svg" alt="Google Play" /></a>
            <a href={appStore} style={{ marginLeft: '50px' }}><img src="images/appstorebadge.svg" alt="App Store" /></a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftSection;
