import HeaderUpdateProject from "../components/UpdateProject/HeaderUpdateProject"
import UpdateProjectContainer from "../components/UpdateProject/UpdateProjectContainer"


const UpdateProjectPage = () => {
  return (
    <div className=" h-full w-full flex flex-col justify-center items-center ">
        <HeaderUpdateProject />
        <UpdateProjectContainer />
    </div>
  )
}

export default UpdateProjectPage