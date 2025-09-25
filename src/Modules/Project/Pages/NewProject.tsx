import HeaderNewProject from "../components/NewProject/HeaderNewProject"
import NewProjectContainer from "../components/NewProject/NewProjectContainer"


const NewProject = () => {
  return (
    <div className=" h-full w-full flex flex-col justify-center items-center ">
        <HeaderNewProject />
        <NewProjectContainer />
    </div>
  )
}

export default NewProject