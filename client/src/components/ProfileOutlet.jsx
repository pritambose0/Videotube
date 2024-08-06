import { useSelector } from "react-redux";
import ProfileCard from "./ProfileCard";
import { Outlet } from "react-router-dom";

function ProfileOutlet() {
  const user = useSelector((state) => state.auth.userData);
  // console.log(user);

  return (
    <>
      <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
        <ProfileCard
          coverPhoto={user?.coverImage}
          avatar={user?.avatar}
          channelName={user?.fullName}
          channelHandle={user?.username}
          subscribers="600k"
          subscribed="220"
        />
        <Outlet />
      </section>
    </>
  );
}

export default ProfileOutlet;
