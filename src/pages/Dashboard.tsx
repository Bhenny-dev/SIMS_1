import React, { useState, useEffect, useRef, useMemo } from 'react';
import Card from '../components/Card.tsx';
import LeaderboardBarChart from '../components/LeaderboardBarChart.tsx';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Team } from '../types.ts';
import { getLeaderboard } from '../services/api.ts';
import { useEventContext } from '../hooks/useEventContext.ts';
import { availableEvents } from '../contexts/EventContext.tsx';
import AnimatedPage from '../components/AnimatedPage.tsx';
import NoDataComponent from '../components/NoDataComponent.tsx';
import Skeleton, { SkeletonCard, SkeletonList } from '../components/Skeleton.tsx';
import TeamProgressLineChart from '../components/TeamProgressLineChart.tsx';
import { getTeamStyles } from '../config.ts';
import { useVisibility } from '../hooks/useVisibility.ts';
import { AMARANTH_JOKERS_TEAM_ID } from '../constants.ts';


const Dashboard: React.FC = () => {
    const { selectedEvent, setSelectedEvent, isDataAvailable } = useEventContext();
    const { settings, isPrivileged } = useVisibility();
    const [leaderboardData, setLeaderboardData] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const staticTeamIds = ['t1', 't2', 't3', 't4'];

    const staticDisplayTeams = useMemo(() => {
        // Get the 4 core teams but maintain the order from staticTeamIds for a fixed display
        return staticTeamIds.map(id => 
            leaderboardData.find(team => team.id === id)
        ).filter((team): team is Team => !!team);
    }, [leaderboardData]);
    
    const rankedCompetingTeams = useMemo(() => {
        // This is the dynamically sorted list for the "Top Teams" section
        return leaderboardData
            .filter(team => team.id !== AMARANTH_JOKERS_TEAM_ID && team.rank > 0)
            .sort((a, b) => a.rank - b.rank);
    }, [leaderboardData]);

    useEffect(() => {
        const fetchData = async () => {
          if (!isDataAvailable) {
            setLeaderboardData([]);
            setLoading(false);
            return;
          }
          setLoading(true);
          try {
            const data = await getLeaderboard();
            setLeaderboardData(data);
          } catch (error) {
            console.error("Failed to load leaderboard data", error);
          } finally {
            setLoading(false);
          }
        };
        fetchData();
      }, [isDataAvailable]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const renderSkeletons = () => (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-3 p-6"><Skeleton className="h-80 w-full" /></Card>
                <div className="lg:col-span-2 space-y-4">
                    <Skeleton className="h-8 w-1/3 mb-2" />
                    <SkeletonList count={3} />
                </div>
            </div>
            <Card className="p-6">
                <Skeleton className="h-8 w-1/2 mb-4" />
                <Skeleton className="h-96 w-full" />
            </Card>
        </>
    );

  return (
    <AnimatedPage className="space-y-6">
       <div className="text-center mb-6">
          <div className="relative inline-block" ref={dropdownRef}>
             <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-center gap-3 text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-50 focus:outline-none transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
             >
                <span>{selectedEvent}</span>
                <i className={`bi bi-chevron-down text-2xl transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
             </button>
             
             <AnimatePresence>
                {isDropdownOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-72 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-10"
                    >
                        <ul className="p-2">
                            {availableEvents.map(event => (
                                <li
                                    key={event}
                                    onClick={() => {
                                        setSelectedEvent(event);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg cursor-pointer transition-colors ${selectedEvent === event ? 'text-indigo-600' : ''}`}
                                >
                                    {event}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
             </AnimatePresence>
          </div>
       </div>

      { !isDataAvailable ? <NoDataComponent /> : loading ? renderSkeletons() : (
        <>
            {(isPrivileged || settings.dashboard.summaryCards) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {staticDisplayTeams.map((team) => {
                        const style = getTeamStyles(team.id);

                        const previousScore = team.scoreHistory?.[0] || 0;
                        const currentScore = team.score;
                        const change = currentScore - previousScore;
                        let percentageChange = 0;

                        if (previousScore !== 0) {
                            percentageChange = (change / previousScore) * 100;
                        } else if (change > 0) {
                            percentageChange = 100;
                        }

                        let changeIndicator = null;
                        if (isPrivileged || settings.competitionScores) {
                            if (change > 0) {
                                changeIndicator = (
                                    <div className="flex items-center gap-1 text-green-500">
                                        <i className="bi bi-arrow-up-right text-lg" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}></i>
                                        <span className="font-semibold text-sm">+{percentageChange.toFixed(0)}%</span>
                                    </div>
                                );
                            } else if (change < 0) {
                                changeIndicator = (
                                    <div className="flex items-center gap-1 text-red-500">
                                        <i className="bi bi-arrow-down-right text-lg" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}></i>
                                        <span className="font-semibold text-sm">{percentageChange.toFixed(0)}%</span>
                                    </div>
                                );
                            } else {
                                changeIndicator = (
                                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                                        <i className="bi bi-dash-lg text-lg" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}></i>
                                        <span className="font-semibold text-sm">{percentageChange.toFixed(0)}%</span>
                                    </div>
                                );
                            }
                        }

                        return (
                            <Card key={team.id} className="p-5">
                                <div className="flex items-center gap-2">
                                    <i className={`${style.icon} text-lg`} style={{ color: style.gradient.from }}></i>
                                    <small className="text-slate-500 dark:text-slate-400 font-semibold">{team.name}</small>
                                </div>
                                <div className="flex items-baseline justify-between mt-1">
                                    <h4 className="font-bold text-2xl text-slate-800 dark:text-slate-100 mb-0">
                                        {(isPrivileged || settings.competitionScores) ? `${team.score} Points` : 'Points Hidden'}
                                    </h4>
                                    {changeIndicator}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {((isPrivileged || settings.dashboard.leaderboardRanking) && (isPrivileged || settings.competitionScores)) && (
                    <Card className="lg:col-span-3">
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-4">Leaderboard Ranking</h2>
                        </div>
                        <div className="px-6 pb-6">
                            <LeaderboardBarChart teams={staticDisplayTeams} />
                        </div>
                    </Card>
                )}
                {((isPrivileged || settings.dashboard.topTeams) && (isPrivileged || settings.competitionScores)) && (
                    <div className={`space-y-4 ${!((isPrivileged || settings.dashboard.leaderboardRanking) && (isPrivileged || settings.competitionScores)) ? 'lg:col-span-5' : 'lg:col-span-2'}`}>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Top Teams</h2>
                            <div className="space-y-3">
                                {rankedCompetingTeams.slice(0, 5).map(team => {
                                    const style = getTeamStyles(team.id);
                                    return (
                                    <Card key={team.id} className="p-4 cursor-pointer group hover:shadow-md transition-shadow" onClick={() => navigate(`/teams?teamId=${team.id}`)}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                                            <i className={`${style.icon} text-xl`} style={{ color: style.gradient.from }}></i>
                                            <span>{team.name}</span>
                                        </h3>
                                        {(isPrivileged || settings.competitionScores) && <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">#{team.rank}</span>}
                                    </div>
                                    <div className="flex justify-between items-end pt-2 border-t border-slate-100 dark:border-slate-700">
                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                            <i className="bi bi-people-fill mr-1"></i>{team.playersCount} Members
                                        </div>
                                        {(isPrivileged || settings.competitionScores) && <span className="font-bold text-slate-800 dark:text-slate-100">{team.score} pts</span>}
                                    </div>
                                    </Card>
                                )})}
                            </div>
                    </div>
                )}
            </div>
            
            {(isPrivileged || settings.dashboard.teamScoreProgression) && (
                <Card>
                    <div className="p-6">
                        <h2 className="text-xl font-bold mb-4">Team Score Progression</h2>
                    </div>
                    <div className="px-6 pb-6">
                        <TeamProgressLineChart teams={rankedCompetingTeams} />
                    </div>
                </Card>
            )}
        </>
      )}

    </AnimatedPage>
  );
};

export default Dashboard;