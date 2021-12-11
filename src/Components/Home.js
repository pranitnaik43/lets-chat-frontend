import Chat from "./Chat";
import ChatList from "./ChatList";
import { useState, useEffect } from "react";
import socketClient from "socket.io-client";

const Home = () => {
  const maxSmallScreenWidth = 768;
  const [screenWidth, setWidth] = useState(window.innerWidth);
  const [isSmallScreen, setIsSmallScreen] = useState(screenWidth < maxSmallScreenWidth);
  const [connection, setConnection] = useState(null);

  var socket = socketClient(process.env.REACT_APP_SERVER_URL);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });
    socket.on('connection', () => {
      console.log("new connection");
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setIsSmallScreen(screenWidth < maxSmallScreenWidth);
  }, [screenWidth]);

  return (
    <>
      {/* {console.log("check", connection)} */}
      <div className="">
        <div className="row mt-md-3 mx-md-2 mx-lg-4 border rounded">
          {/* List of friends and groups */}
          {
            (!isSmallScreen || !connection) ? (
              <div className="col-12 col-md-4 col-lg-3 p-0 m-0 border border-white rounded">
                <ChatList setConnection={setConnection} />
              </div>
            ) : (<></>)
          }
          {/* chat section */}
          <div className="col-12 col-md-8 col-lg-9 p-0 m-0 border border-white rounded">
            {
              (connection) ? (
                <Chat connection={connection} setConnection={setConnection} socket={socket} />
              ) : (<></>)
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
