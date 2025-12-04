import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import { getAll, getDealsByStage, getPipelineAnalytics, moveToStage, DEAL_STAGES } from "@/services/api/dealService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import DealCard from "@/components/molecules/DealCard";
import StageHeader from "@/components/molecules/StageHeader";

const Pipeline = () => {
  const [deals, setDeals] = useState([]);
const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dragDisabled, setDragDisabled] = useState(false);

  // Load pipeline data
  const loadPipelineData = async () => {
    try {
      setLoading(true);
      setError(null);
      
const [dealsData, analyticsData] = await Promise.all([
        getAll(),
        getPipelineAnalytics()
      ]);
      
      setDeals(dealsData);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Error loading pipeline data:', err);
      setError('Failed to load pipeline data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter deals based on search term
  const filteredDeals = React.useMemo(() => {
    if (!searchTerm.trim()) return deals;
    
    const term = searchTerm.toLowerCase();
    return deals.filter(deal => 
      deal.title?.toLowerCase().includes(term) ||
      deal.company?.toLowerCase().includes(term) ||
      deal.description?.toLowerCase().includes(term)
    );
  }, [deals, searchTerm]);

  useEffect(() => {
    loadPipelineData();
  }, []);

  // Handle drag end
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // No destination or same position
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    const dealId = parseInt(draggableId);
    const newStage = destination.droppableId;
    
    // Optimistically update UI
    const updatedDeals = deals.map(deal => 
      deal.Id === dealId ? { ...deal, stage: newStage } : deal
    );
    setDeals(updatedDeals);

    try {
setDragDisabled(true);
      await moveToStage(dealId, newStage);
      
// Reload analytics after successful move
      const newAnalytics = await getPipelineAnalytics();
      setAnalytics(newAnalytics);
    } catch (err) {
      console.error('Error moving deal:', err);
      toast.error('Failed to move deal. Please try again.');
      
      // Revert optimistic update on error
      setDeals(deals);
    } finally {
      setDragDisabled(false);
    }
  };

  // Handle deal actions
  const handleDealEdit = (deal) => {
    // TODO: Open deal edit modal
    console.log('Edit deal:', deal);
    toast.info('Deal edit functionality coming soon');
  };

  const handleDealDelete = async (deal) => {
    if (!window.confirm(`Are you sure you want to delete "${deal.title}"?`)) {
      return;
    }

try {
      // Note: delete function not available in current service, using placeholder
      console.log('Delete deal:', deal.Id);
      toast.info('Delete functionality will be implemented soon');
      return;
      setDeals(prev => prev.filter(d => d.Id !== deal.Id));
      
// Update analytics
      const newAnalytics = await getPipelineAnalytics();
      setAnalytics(newAnalytics);
    } catch (err) {
      console.error('Error deleting deal:', err);
      toast.error('Failed to delete deal. Please try again.');
    }
  };

  const handleDealView = (deal) => {
    // TODO: Open deal details modal
    console.log('View deal:', deal);
    toast.info('Deal details functionality coming soon');
  };
// Get deals for specific stage
  const getDealsByStageLocal = (stageId) => {
    return filteredDeals.filter(deal => deal.stage === stageId);
  };

  // Loading state
  if (loading) {
    return <Loading />;
  }

  // Error state
  if (error) {
    return (
      <ErrorView
        title="Pipeline Error"
        message={error}
        onRetry={loadPipelineData}
      />
    );
  }

return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 pipeline-scroll-container overflow-y-auto">
{/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-4">
              <ApperIcon name="Workflow" size={20} className="text-primary" />
              Sales Pipeline
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              Total Deals: <span className="font-semibold text-gray-900">{filteredDeals.length}</span>
            </div>
            <div className="text-sm text-gray-500">
              Total Value: <span className="font-semibold text-green-600">
                ${filteredDeals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4">
          <div className="relative max-w-md">
            <ApperIcon
              name="Search"
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            />
            <input
              type="text"
              placeholder="Search deals by title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors bg-white"
            />
          </div>
        </div>

        {/* Deal Age Legend */}
        <div className="flex items-center gap-6 mt-4 p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Deal Age:</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-600">New (0-7 days)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs text-gray-600">Aging (8-30 days)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs text-gray-600">Stale (30+ days)</span>
          </div>
        </div>
      </div>

      {/* Pipeline Board */}
<div className="flex-1 overflow-y-auto">
{filteredDeals.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <Empty
              title="No Deals Found"
              description="Start by creating your first deal to see it in the pipeline."
            />
          </div>
) : (
          <DragDropContext onDragEnd={handleDragEnd}>
<div className="h-full p-6 pipeline-grid-container pipeline-scroll-container">
<div className="grid grid-cols-1 lg:grid-cols-5 gap-8 h-full min-w-fit">
                {Object.values(DEAL_STAGES).map((stage) => {
                  const stageDeals = getDealsByStageLocal(stage.id);
                  const stageAnalytics = analytics[stage.id] || {};

                  return (
<div key={stage.id} className="flex flex-col h-full min-w-[280px]">
                      {/* Stage Header */}
                      <StageHeader
                        stage={stage}
                        dealCount={stageDeals.length}
                        analytics={stageAnalytics}
                      />

                      {/* Drop Zone */}
                      <Droppable droppableId={stage.id}>
                        {(provided, snapshot) => (
<div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`
                              flex-1 p-5 rounded-lg min-h-[200px] transition-all duration-200 pipeline-stage-scroll overflow-y-auto space-y-4
                              ${snapshot.isDraggingOver 
                                ? 'bg-blue-50 border-2 border-blue-300 border-dashed' 
                                : 'bg-gray-50 border-2 border-gray-200 border-dashed'
                              }
                            `}
                          >
<div className="space-y-4">
                              {stageDeals.map((deal, index) => (
                                <Draggable
                                  key={deal.Id}
                                  draggableId={deal.Id.toString()}
                                  index={index}
                                  isDragDisabled={dragDisabled}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`
                                        transition-transform duration-200
                                        ${snapshot.isDragging 
                                          ? 'transform rotate-3 scale-105 z-50' 
                                          : ''
                                        }
                                      `}
                                    >
                                      <DealCard
                                        deal={deal}
                                        onEdit={handleDealEdit}
                                        onDelete={handleDealDelete}
                                        onView={handleDealView}
                                        isDragging={snapshot.isDragging}
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            </div>
                            {provided.placeholder}
                            
                            {/* Empty state for stage */}
                            {stageDeals.length === 0 && (
                              <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                                <ApperIcon name="Plus" size={24} />
                                <p className="text-sm mt-2">Drop deals here</p>
                              </div>
                            )}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  );
                })}
              </div>
            </div>
          </DragDropContext>
        )}
      </div>
    </div>
  );
};

export default Pipeline;