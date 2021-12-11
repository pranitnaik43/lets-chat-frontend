import Chat from "./Chat";
import ChatList from "./ChatList";
import { useState, useEffect } from "react";

const Home = () => {
  const maxSmallScreenWidth = 768;
  const [screenWidth, setWidth] = useState(window.innerWidth);
  const [isSmallScreen, setIsSmallScreen] = useState(screenWidth<maxSmallScreenWidth);
  const [connection, setConnection] = useState(null);
  
  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });
  }, []);

  useEffect(() => {
    setIsSmallScreen(screenWidth<maxSmallScreenWidth);
  }, [screenWidth]);

  return ( 
    <>
    {/* {console.log("check", connection)} */}
      <div className="">
        <div className="row my-md-3 mx-md-2 mx-lg-4 border rounded">
          {/* friends and groups */}
          <div className="col-12 col-md-4 col-lg-3 p-0 m-0 border border-white rounded">
            <ChatList setConnection={setConnection}/>
          </div>

          {/* chat section */}
          <div className="col-12 col-md-8 col-lg-9 p-0 m-0 border border-white rounded">
          {
            (connection) ? (
              <Chat connection={connection}/>
            ) : (<></>)
          }
          </div>
        </div>
      </div>
    </>
  );
}
 
export default Home;
