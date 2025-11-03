import WebApp from "@twa-dev/sdk";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaCircleCheck } from "react-icons/fa6";
import { IoChevronBackOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../services/store";
import { useGetUserTasksQuery } from "../../../services/routes";

interface UserTask {
  slug: string;
  title: string;
  description: string;
  points: number;
  icon?: { url: string };
  completed?: boolean;
}

interface Project {
  id?: string;
  _id?: string;
  name: string;
  icon?: { url: string };
  tasks: UserTask[];
}

function ProjectTasks() {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const user = useSelector((state: RootState) => state.user.profile);
  const savedUser = user?.username;
  
  // Fetch projects in case navigation state is lost
  const { data: projectsData, isSuccess: projectsSuccess } = useGetUserTasksQuery({
    username: savedUser,
  });

  WebApp.BackButton.show();
  WebApp.BackButton.onClick(() => navigate(-1));

  useEffect(() => {
    // First try to get project from navigation state
    if (location.state?.project) {
      setProject(location.state.project);
      return;
    }
    
    // If no navigation state, try to find project from fetched data
    if (projectId && projectsSuccess && projectsData?.data) {
      const foundProject = projectsData.data.find((p: Project) => 
        (p.id === projectId || p._id === projectId)
      );
      if (foundProject) {
        setProject(foundProject);
      } else {
        // If project not found in data, navigate back to tasks
        navigate('/tasks', { replace: true });
      }
    } else if (projectId && projectsSuccess && (!projectsData?.data || projectsData.data.length === 0)) {
      // Data loaded but empty or invalid, navigate back
      navigate('/tasks', { replace: true });
    }
    // If projectsSuccess is false, wait for data to load (no action needed)
  }, [location.state, projectId, projectsData, projectsSuccess, navigate]);

  if (!project) {
    return (
      <div className="text-white flex w-full px-[10px] items-center flex-col justify-center">
        <p className="text-center mt-6 text-gray-400">Loading project...</p>
      </div>
    );
  }

  return (
    <div className="text-white flex w-full px-[10px] items-center flex-col justify-center">
      <div className="flex items-center justify-between w-full mb-[20px]">
        <button onClick={() => navigate(-1)} className="z-20 text-white">
          <IoChevronBackOutline className="text-white text-[20px]" />
        </button>
        <p className="text-white font-[600] text-[24px] grow ml-[-10%] text-center">
          {project.name}
        </p>
      </div>

      <p className="text-[15px] text-center text-white font-[500] w-[90%] mb-[20px]">
        Select a task to get started and earn rewards.
      </p>

      <div className="w-full mt-[20px]">
        <div className="relative w-full p-[10px]">
          <p className="text-[20px] font-[600] text-white mb-[20px]">Tasks</p>

          <div className="mt-[20px] grid grid-cols-1 gap-4">
            {project.tasks && project.tasks.length > 0
              ? project.tasks.map((task) => (
                  <button
                    key={task.slug}
                    onClick={() => navigate(`/tasks/${task.slug}`)}
                    className="border-[#FFD683] border p-[15px] rounded-[10px] w-full text-left hover:bg-[#FFD683]/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-[10px]">
                        <div className="h-[50px] min-w-[50px] w-[50px] rounded-full border overflow-hidden flex items-center justify-center bg-white">
                          {task.icon?.url ? (
                            <img
                              src={task.icon.url}
                              alt={task.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xs text-gray-600">
                              No Icon
                            </span>
                          )}
                        </div>
                        <p className="text-[16px] font-[500]">{task.title}</p>
                      </div>
                    </div>

                    <div className="text-start text-white text-[14px] mt-[10px] line-clamp-2">
                      {task.description}
                    </div>
                    <div className="flex items-center space-x-[10px] mt-[10px]">
                      <p className="text-[#FFB948] font-[600]">{task.points} $MARP</p>
                      {task.completed && (
                        <FaCircleCheck size={20} className="text-[#40D8A1]" />
                      )}
                    </div>
                  </button>
                ))
              : (
                  <p className="text-center text-gray-400 mt-6 italic">
                    No tasks available in this project
                  </p>
                )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectTasks;

