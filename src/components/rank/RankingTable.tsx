const rankingData = [
  {
    username: "@jurstadev",
    rank: "Sergeant",
    earnings: "50,022 $MARS",
  },
  // Add more ranking data here
];

const RankingTable = () => {
  return (
    <div className="w-full mt-10">
      <div className="relative overflow-x-auto">
        <table className="w-full">
          <thead className="text-sm text-white border-b border-gray-400">
            <tr>
              <th scope="col" className="px-3 text-[12px] py-3">
                User Name
              </th>
              <th scope="col" className="px-3 text-[12px] py-3">
                Rank
              </th>
              <th scope="col" className="px-3 text-[12px] py-3">
                Earnings
              </th>
            </tr>
          </thead>
          <tbody>
            {rankingData.map((user, index) => (
              <tr key={index} className="text-sm">
                <th
                  scope="row"
                  className="px-3 text-[12px] py-4 font-medium whitespace-nowrap text-center text-gray-300"
                >
                  {user.username}
                </th>
                <td className="px-3 text-[12px] py-4 text-center text-gray-300">
                  {user.rank}
                </td>
                <td className="px-3 text-[12px] py-4 text-center text-green-400">
                  {user.earnings}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RankingTable;
