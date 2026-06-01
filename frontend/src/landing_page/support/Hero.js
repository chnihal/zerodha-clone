import React from "react";

function Hero() {
  return (
    <section className="container-fluid" id="supportHero">
      <div className="p-4" id="supportWrapper">
        <h4>Support Portal</h4>
        <a href="">Track Tickets</a>
      </div>
      <div className="row p-3 m-3">
        <div className="col-1"></div>
        <div className="col-5 p-3">
          <h5 className="fs-3 mb-3">
            Search for an answer or browser help topics to create a ticket
          </h5>
          <input className="mb-3" placeholder="Eg. How do I activate f&o" />
          <br></br>
          <a style={{marginRight: "15px"}} href="">Track account opening</a>
          <a style={{marginRight: "15px"}} href="">Track segment activation</a>
          <a style={{marginRight: "15px"}} href="">Intraday margins</a>
          <a href="">Kite user manual</a>
        </div>
        <div className="col-2"></div>
        <div className="col-4 p-3 text-left">
          <h5 className="fs-3">Featured</h5>
          <a href="">1.Current Takeovers and Delisting</a>
          <br></br>
          <a href="">2.Latest Intraday Leverages</a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
