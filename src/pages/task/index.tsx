import WebApp from "@twa-dev/sdk";
import { useNavigate } from "react-router-dom";
import { useGetProjectsQuery } from "../../services/routes";
import { useEffect, useState } from "react";
import { IoChevronForwardOutline } from "react-icons/io5";

interface UserTask {
  slug: string;
  title: string;
  description: string;
  points: number;
  icon?: { url: string };
  completed?: boolean;
}

interface Project {
  slug: string;
  id?: string;
  _id?: string;
  name: string;
  icon?: { url: string };
  tasks?: UserTask[];
  description?: string;
  joined?: boolean;
}

function Task() {
  WebApp.BackButton.hide();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);

  const { data, isSuccess, isLoading, isError } = useGetProjectsQuery("projects");

  useEffect(() => {
    if (isSuccess) {
      // Backend returns projects
      setProjects(data?.data || data || []);
    }
  }, [data, isSuccess]);

  const handleProjectClick = (project: Project) => {
    const projectSlug = project.slug || project.id || project._id || '';
    navigate(`/tasks/project/${projectSlug}`, { state: { project } });
  };

  return (
    <div className="text-white flex w-full px-[10px] items-center flex-col justify-center">
      <p className="text-[#FFB948] font-[900] text-[35px] mt-[20px]">
        Social Task
      </p>
      <p className="text-[15px] text-center text-white font-[500] w-[90%]">
        Perform Social Tasks to earn more Matara Tokens ($MARP) and grow your
        rank.
      </p>

      <div className="w-full mt-[40px]">
        <div className="relative w-full p-[10px]">
          <p className="text-[20px] font-[600] text-white">Projects</p>

          {/* Loading / Error states */}
          {isLoading && (
            <p className="text-center mt-6 text-gray-400">Loading projects…</p>
          )}
          {isError && (
            <p className="text-center mt-6 text-red-400">
              Failed to load projects
            </p>
          )}

          <div className="mt-[20px] grid grid-cols-1 gap-4">
            {projects.length > 0
              ? projects.map((project) => (
                  <button
                    key={project.slug || project.id || project._id || project.name}
                    onClick={() => handleProjectClick(project)}
                    className="border-[#FFD683] border p-[15px] rounded-[10px] w-full text-left hover:bg-[#FFD683]/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-[10px] flex-1">
                        <div className="h-[50px] min-w-[50px] w-[50px] rounded-full border overflow-hidden flex items-center justify-center bg-white">
                          {project.icon?.url ? (
                            <img
                              src={project.icon.url}
                              alt={project.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xs text-gray-600">
                              No Icon
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-[16px] font-[500]">{project.name}</p>
                          <p className="text-[12px] text-gray-400 mt-1">
                            {project.tasks?.length || 0} task{project.tasks?.length !== 1 ? 's' : ''}
                            {project.joined && (
                              <span className="ml-2 text-[#40D8A1]">• Joined</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <IoChevronForwardOutline className="text-[#FFD683] text-[20px]" />
                    </div>
                  </button>
                ))
              : !isLoading && (
                  <p className="text-center text-gray-400 mt-6 italic">
                    No projects available
                  </p>
                )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Task;
