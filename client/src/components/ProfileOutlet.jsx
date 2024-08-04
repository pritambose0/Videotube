import ProfileCard from "./ProfileCard";
import { Outlet } from "react-router-dom";

function ProfileOutlet() {
  return (
    <>
      <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
        <ProfileCard
          coverPhoto="https://images.pexels.com/photos/1092424/pexels-photo-1092424.jpeg?auto=compress"
          channelPhoto="https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          channelName="React Patterns"
          channelHandle="reactpatterns"
          subscribers="600k"
          subscribed="220"
        />
        <Outlet />
      </section>
    </>
  );
}

export default ProfileOutlet;
