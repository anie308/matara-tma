import WebApp from "@twa-dev/sdk";
import { useNavigate } from "react-router-dom";
import { useGetProjectsQuery, useJoinProjectMutation } from "../../services/routes";
import { useEffect, useState } from "react";
import { IoChevronForwardOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { RootState } from "../../services/store";
import { toast } from "react-hot-toast";

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
  joinedUsers?: string[];
  participantsCount?: number;
  numberOfParticipants?: number;
  status?: 'in-progress' | 'completed';
}

function Task() {
  WebApp.BackButton.hide();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [joiningProjectSlug, setJoiningProjectSlug] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user.profile);
  const savedUser = user?.username;

  const { data, isSuccess, isLoading, isError } = useGetProjectsQuery("projects");
  const [joinProject] = useJoinProjectMutation();

  useEffect(() => {
    if (isSuccess) {
      // Backend returns projects
      setProjects(data?.data || data || []);
    }
  }, [data, isSuccess]);
  console.log(projects, "projects");

  const handleJoinAndNavigate = async (project: Project, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    const projectSlug = project.slug || project.id || project._id || '';
    
    if (!projectSlug || !savedUser || joiningProjectSlug || project?.joined) {
      // If already joined, just navigate
      if (project?.joined) {
        navigate(`/tasks/project/${projectSlug}`, { state: { project } });
      }
      return;
    }

    try {
      setJoiningProjectSlug(projectSlug);
      await joinProject({
        slug: projectSlug,
        reqData: {
          username: savedUser,
        },
      }).unwrap();
      
      toast.success('Successfully joined project!');
      
      // Update local project state
      setProjects(prevProjects => 
        prevProjects.map(p => 
          p.slug === projectSlug || p.id === projectSlug || p._id === projectSlug
            ? { ...p, joined: true, participantsCount: (p.participantsCount || 0) + 1 }
            : p
        )
      );
      
      // Navigate to project details
      navigate(`/tasks/project/${projectSlug}`, { state: { project: { ...project, joined: true } } });
    } catch (error: any) {
      console.error('Error joining project:', error);
      toast.error(error?.data?.message || 'Failed to join project');
    } finally {
      setJoiningProjectSlug(null);
    }
  };

  const handleProjectClick = (project: Project) => {
    const projectSlug = project.slug || project.id || project._id || '';
    navigate(`/tasks/project/${projectSlug}`, { state: { project } });
  };

  const getStatusBadge = (status?: string) => {
    if (status === 'completed') {
      return <span className="px-2 py-1 rounded-full text-xs font-[500] bg-[#40D8A1]/20 text-[#40D8A1] border border-[#40D8A1]">Completed</span>;
    }
    return <span className="px-2 py-1 rounded-full text-xs font-[500] bg-[#FFB948]/20 text-[#FFB948] border border-[#FFB948]">In Progress</span>;
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
                  <div
                    key={project.slug || project.id || project._id || project.name}
                    className="border-[#FFD683] border p-[15px] rounded-[10px] w-full hover:bg-[#FFD683]/10 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
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
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-[16px] font-[500]">{project.name}</p>
                            {project.joined && (
                              <span className="text-[#40D8A1] text-xs">✓ Joined</span>
                            )}
                          </div>
                          <p className="text-[12px] text-gray-400">
                            {project.tasks?.length || 0} task{project.tasks?.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleProjectClick(project)}
                        className="text-[#FFD683] hover:text-[#FFB948] transition-colors"
                      >
                        <IoChevronForwardOutline className="text-[20px]" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3">
                        <p className="text-[12px] text-gray-400">
                          <span className="text-white font-[500]">
                            {project.joinedUsers?.length || 0}
                          </span>
                          {project.numberOfParticipants && (
                            <span> / {project.numberOfParticipants}</span>
                          )} participants
                        </p>
                        {getStatusBadge(project.status)}
                      </div>
                      {!project.joinedUsers?.includes(user?._id || '') && (() => {
                        const projectSlug = project.slug || project.id || project._id || '';
                        const isThisProjectJoining = joiningProjectSlug === projectSlug;
                        return (
                          <button
                            onClick={(e) => handleJoinAndNavigate(project, e)}
                            disabled={isThisProjectJoining}
                            className="btn text-[#131721] font-[600] text-[12px] px-4 py-2 rounded-[8px] disabled:opacity-50"
                          >
                            {isThisProjectJoining ? 'Joining...' : 'Join'}
                          </button>
                        );
                      })()}
                    </div>
                  </div>
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
