import WebApp from "@twa-dev/sdk";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaCircleCheck } from "react-icons/fa6";
import { IoChevronBackOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../services/store";
import { useGetSingleProjectQuery, useJoinProjectMutation } from "../../../services/routes";
import { toast } from "react-hot-toast";

interface UserTask {
  slug: string;
  title: string;
  description: string;
  points: number;
  icon?: { url: string };
  completed?: boolean;
}

interface JoinedUser {
  _id: string;
  username?: string;
  profilePicture?: string;
}

interface Project {
  slug: string;
  id?: string;
  _id?: string;
  name: string;
  icon?: { url: string };
  logo?: { url: string; public_id?: string };
  tasks?: UserTask[];
  description?: string;
  joinedUsers?: (string | JoinedUser)[];
  joined?: boolean;
  participantsCount?: number;
  numberOfParticipants?: number;
  status?: 'in-progress' | 'completed';
}

function ProjectTasks() {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const user = useSelector((state: RootState) => state.user.profile);
  const savedUser = user?.username;
  
  // Use projectId as slug for API call
  const slug = projectId || '';
  
  // Fetch single project by slug
  const { data: projectData, isSuccess: projectSuccess, isLoading: projectLoading, isError: projectError } = useGetSingleProjectQuery({
    slug: slug,
  }, {
    skip: !slug,
  });

  console.log(projectData?.data?.joinedUsers, "projectData joinedUsers");

  const [joinProject, { isLoading: isJoining }] = useJoinProjectMutation();

  // Helper function to check if user is joined
  const isUserJoined = (project: Project | null, username: string | null | undefined): boolean => {
    if (!username || !project?.joinedUsers) return false;
    return project.joinedUsers.some((joinedUser) => {
      if (typeof joinedUser === 'string') {
        return joinedUser === username;
      }
      return joinedUser.username === username;
    });
  };

  WebApp.BackButton.show();
  WebApp.BackButton.onClick(() => navigate(-1));

  useEffect(() => {
    // First try to get project from navigation state (for quick display)
    if (location.state?.project) {
      setProject(location.state.project);
    }

    // Then fetch from API to get latest data
    if (projectSuccess && projectData?.data ) {
      setProject(projectData?.data as Project);
    } else if (projectError && slug) {
      // If project not found, navigate back to tasks
      toast.error('Project not found');
      navigate('/tasks', { replace: true });
    }
  }, [location.state, projectData, projectSuccess, projectError, slug, navigate]);

  const handleJoinProject = async () => {
    const username = savedUser;
    const userJoined = isUserJoined(project, username);
    
    if (!slug || !savedUser || isJoining || userJoined) return;

    try {
      const result = await joinProject({
        slug: slug,
        reqData: {
          username: savedUser,
        },
      }).unwrap();
      console.log(result)
      
      toast.success('Successfully joined project!');
      
      // Update local project state - add user object to joinedUsers array
      if (project && savedUser) {
        const newJoinedUser: JoinedUser = {
          _id: user?._id || '',
          username: savedUser,
          profilePicture: user?.profilePicture || undefined
        };
        setProject({ 
          ...project, 
          joinedUsers: [...(project.joinedUsers || []), newJoinedUser]
        });
      }
      
      // Optionally refetch project data
      if (projectSuccess) {
        // The query will automatically refetch due to invalidatesTags
      }
    } catch (error: any) {
      console.error('Error joining project:', error);
      toast.error(error?.data?.message || 'Failed to join project');
    }
  };

  if (projectLoading || !project) {
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

      {project.description && (
        <p className="text-[15px] text-center text-white font-[500] w-[90%] mb-[10px]">
          {project.description}
        </p>
      )}

      {(() => {
        const username = savedUser;
        const userJoined = isUserJoined(project, username);
        
        if (!userJoined) {
          return (
            <div className="w-full px-[10px] mb-[20px]">
              <button
                onClick={handleJoinProject}
                disabled={isJoining}
                className="btn w-full text-[#131721] font-[600] text-[18px] p-[16px_16px] rounded-[10px] disabled:opacity-50"
              >
                {isJoining ? 'Joining...' : 'Join Project'}
              </button>
            </div>
          );
        }
        
        return (
          <div className="w-full px-[10px] mb-[20px]">
            <div className="bg-[#40D8A1]/20 border border-[#40D8A1] rounded-[10px] p-[12px] text-center">
              <p className="text-[#40D8A1] font-[500] text-[14px]">✓ You've joined this project</p>
            </div>
          </div>
        );
      })()}

      <p className="text-[15px] text-center text-white font-[500] w-[90%] mb-[20px]">
        {(() => {
          const username = savedUser;
          const userJoined = isUserJoined(project, username);
          return userJoined ? 'Select a task to get started and earn rewards.' : 'Join the project to access tasks.';
        })()}
      </p>

      <div className="w-full mt-[20px]">
        <div className="relative w-full p-[10px]">
          <p className="text-[20px] font-[600] text-white mb-[20px]">Tasks</p>

          <div className="mt-[20px] grid grid-cols-1 gap-4">
            {(() => {
              const username = savedUser;
              const userJoined = isUserJoined(project, username);
              
              if (!userJoined) {
                return (
                  <p className="text-center text-gray-400 mt-6 italic">
                    Join the project to view tasks
                  </p>
                );
              }
              
              if (project.tasks && project.tasks.length > 0) {
                return project.tasks.map((task) => (
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
                ));
              }
              
              return (
                <p className="text-center text-gray-400 mt-6 italic">
                  No tasks available in this project
                </p>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectTasks;

