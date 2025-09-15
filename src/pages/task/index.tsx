import WebApp from "@twa-dev/sdk";
import { useNavigate } from "react-router-dom";
import { FaCircleCheck } from "react-icons/fa6";
import { useGetUserTasksQuery } from "../../services/routes";
import { RootState } from "../../services/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

interface UserTask {
  slug: string;
  title: string;
  description: string;
  points: number;
  icon?: { url: string };
  completed?: boolean;
}

function Task() {
  WebApp.BackButton.hide();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<UserTask[]>([]);
  const user = useSelector((state: RootState) => state.user.profile);
  const savedUser = user?.username;

  const { data, isSuccess, isLoading, isError } = useGetUserTasksQuery({
    username: savedUser,
  });

  useEffect(() => {
    if (isSuccess) {
      setTasks(data?.data || []);
    }
  }, [data, isSuccess]);

  return (
    <div className="text-white flex w-full px-[10px] items-center flex-col justify-center">
      <p className="text-[#FFB948] font-[900] text-[35px] mt-[20px]">Social Task</p>
      <p className="text-[15px] text-center text-white font-[500] w-[90%]">
        Perform Social Tasks to earn more Matara Tokens ($MARS) and grow your rank.
      </p>

      <div className="w-full mt-[40px]">
        <div className="relative w-full p-[10px]">
          <p className="text-[20px] font-[600] text-white">Tasks</p>

          {/* Loading / Error states */}
          {isLoading && (
            <p className="text-center mt-6 text-gray-400">Loading tasks…</p>
          )}
          {isError && (
            <p className="text-center mt-6 text-red-400">Failed to load tasks</p>
          )}

          <div className="mt-[20px] grid grid-cols-1 gap-4">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <button
                  key={task.slug}
                  onClick={() => navigate(`/tasks/${task.slug}`)}
                  className="border-[#FFD683] border p-[15px] rounded-[10px] w-full text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-[10px]">
                      <div className="h-[50px] w-[50px] rounded-full border overflow-hidden flex items-center justify-center bg-white">
                        {task.icon?.url ? (
                          <img
                            src={task.icon.url}
                            alt={task.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-gray-600">No Icon</span>
                        )}
                      </div>
                      <p className="text-[18px] font-[500]">{task.title}</p>
                    </div>

                    <div className="flex items-center space-x-[10px]">
                      <p>{task.points} $MARS</p>
                      {task.completed && (
                        <FaCircleCheck size={20} className="text-[#40D8A1]" />
                      )}
                    </div>
                  </div>

                  <div className="text-start text-white text-[14px] mt-[10px] line-clamp-2">
                    {task.description}
                  </div>
                </button>
              ))
            ) : (
              !isLoading && (
                <p className="text-center text-gray-400 mt-6 italic">
                  No tasks available
                </p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Task;
