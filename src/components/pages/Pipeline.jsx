import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import dealService from '@/services/api/dealService';
import DealCard from '@/components/molecules/DealCard';
import StageHeader from '@/components/molecules/StageHeader';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

const Pipeline = () => {
  const [deals, setDeals] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dragDisabled, setDragDisabled] = useState(false);

  // Load pipeline data
  const loadPipelineData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [dealsData, analyticsData] = await Promise.all([
        dealService.getAll(),
        dealService.getPipelineAnalytics()
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
      await dealService.moveToStage(dealId, newStage);
      
      // Reload analytics after successful move
      const newAnalytics = await dealService.getPipelineAnalytics();
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
      await dealService.delete(deal.Id);
      setDeals(prev => prev.filter(d => d.Id !== deal.Id));
      
      // Update analytics
      const newAnalytics = await dealService.getPipelineAnalytics();
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
  const getDealsByStage = (stageId) => {
    return deals.filter(deal => deal.stage === stageId);
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
<div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 pipeline-scroll-container">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <ApperIcon name="Workflow" size={32} className="text-primary" />
              Sales Pipeline
            </h1>
            <p className="text-gray-600 mt-1">
              Manage deals across pipeline stages with drag & drop
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              Total Deals: <span className="font-semibold text-gray-900">{deals.length}</span>
            </div>
            <div className="text-sm text-gray-500">
              Total Value: <span className="font-semibold text-green-600">
                ${deals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}
              </span>
            </div>
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
<div className="flex-1 overflow-hidden">
        {deals.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <Empty 
              title="No Deals Found"
              description="Start by creating your first deal to see it in the pipeline."
            />
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
<div className="h-full p-6 pipeline-grid-container">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full min-w-fit">
                {Object.values(dealService.DEAL_STAGES).map((stage) => {
                  const stageDeals = getDealsByStage(stage.id);
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
                              flex-1 p-4 rounded-lg min-h-[200px] transition-all duration-200 pipeline-stage-scroll
                              ${snapshot.isDraggingOver 
                                ? 'bg-blue-50 border-2 border-blue-300 border-dashed' 
                                : 'bg-gray-50 border-2 border-gray-200 border-dashed'
                              }
                            `}
                          >
                            <div className="space-y-3">
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