import Chat from "./Chat";
import ChatList from "./ChatList";
import { useState, useEffect } from "react";

const Home = () => {

  const maxSmallScreenWidth = 768;
  let initialWidth = window.innerWidth;
  console.log(initialWidth);
  const [screenWidth, setWidth] = useState(initialWidth);
  const [isSmallScreen, setIsSmallScreen] = useState(initialWidth < maxSmallScreenWidth);
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
      //clean state on unmount
      return () => {
        setWidth(null);
        setIsSmallScreen(null);
      };
    });

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setIsSmallScreen(screenWidth < maxSmallScreenWidth);
  }, [screenWidth]);

  return (
    <div className="mainPage">
      <div className="container-fluid h-100">
        <div className="row h-100 p-md-2 px-lg-4 d-flex justify-content-center">
          {/* List of friends and groups */}
          {
            (!isSmallScreen || !connection) ? (
              <div className="h-100 col-12 col-md-4 col-lg-3 p-0 m-0">
                <ChatList setConnection={setConnection} />
              </div>
            ) : (<></>)
          }
          {/* chat section */}
          {
            (connection) ? (
              <div className="h-100 col-12 col-md-8 col-lg-9 p-0 m-0">
                <Chat connection={connection} setConnection={setConnection} />
              </div>
            ) : (<></>)
          }

        </div>
      </div>
    </div>
  );
}

export default Home;
