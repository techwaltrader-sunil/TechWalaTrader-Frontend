import { useState, useEffect, useRef } from 'react';
import {hexToRgba} from '../components/algoComponents/Aoc/DrawingPanel/utils';


export const useDrawingTools = (chartRef) => {
    // ==========================================
    // 🎨 DRAWING TOOLS STATES & REFS
    // ==========================================
    const [activeTool, setActiveTool] = useState('cursor');
    const [selectedOverlay, setSelectedOverlay] = useState(null); 
    const [activeColorPicker, setActiveColorPicker] = useState(null); 
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    
    const [fibSettings, setFibSettings] = useState({
        trendLine: { checked: true, color: '#787b86', style: 'dashed' },
        extend: 'Don\'t extend', useOneColor: false, oneColor: '#787b86',
        showBackground: true, backgroundOpacity: 0.2, reverse: false,
        showPrices: true, showLevels: true, textAlign: 'left', textBaseline: 'middle', fontSize: 12,
        levels: [
            { id: '0', value: 0, checked: true, color: '#787b86' },
            { id: '0.236', value: 0.236, checked: false, color: '#f23645' },
            { id: '0.382', value: 0.382, checked: false, color: '#ff9800' },
            { id: '0.5', value: 0.5, checked: true, color: '#4caf50' },
            { id: '0.618', value: 0.618, checked: true, color: '#089981' },
            { id: '0.786', value: 0.786, checked: false, color: '#00bcd4' },
            { id: '1', value: 1, checked: true, color: '#787b86' },
            { id: '1.618', value: 1.618, checked: false, color: '#2962ff' },
            { id: '2.618', value: 2.618, checked: false, color: '#e91e63' },
            { id: '3.618', value: 3.618, checked: false, color: '#9c27b0' },
            { id: '4.236', value: 4.236, checked: false, color: '#e91e63' },
            { id: '1.272', value: 1.272, checked: false, color: '#ff9800' },
            { id: '1.414', value: 1.414, checked: false, color: '#f23645' },
            { id: '2.272', value: 2.272, checked: false, color: '#ff9800' },
        ]
    });

    const [drawingConfig, setDrawingConfig] = useState({
        borderColor: '#2962FF', fillColor: '#2962FF', lineWidth: 2,
        fillOpacity: 0.2, borderOpacity: 1, text: '', textColor: '#2962FF', textSize: 14
    });

    const drawingConfigRef = useRef(drawingConfig);
    const selectedOverlayRef = useRef(null);
    const isOverlayClickedRef = useRef(false);
    const activeOverlayInstanceRef = useRef(null);

    useEffect(() => { drawingConfigRef.current = drawingConfig; }, [drawingConfig]);
    useEffect(() => { selectedOverlayRef.current = selectedOverlay; }, [selectedOverlay]);

    // ==========================================
    // 🖱️ GLOBAL CLICK & KEYBOARD EVENTS (Copy, Paste, Delete)
    // ==========================================
    useEffect(() => {
        const handleGlobalClick = (e) => {
            if (e.target.closest('.settings-modal') || e.target.closest('.edit-panel') || e.target.closest('.left-toolbar')) return;
            
            setTimeout(() => {
                if (!isOverlayClickedRef.current) {
                    setShowSettingsModal(false); 
                    closeEditPanel();
                }
                isOverlayClickedRef.current = false; 
            }, 100);
        };

        const handleKeyDown = (e) => {
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
            const currentSelected = selectedOverlayRef.current;
            
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (currentSelected && typeof currentSelected.id === 'string' && chartRef.current) {
                    chartRef.current.removeOverlay({ id: currentSelected.id });
                    closeEditPanel();
                }
            }
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') copyActiveOverlay();
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') pasteActiveOverlay();
        };

        document.addEventListener('mousedown', handleGlobalClick, true);
        document.addEventListener('keydown', handleKeyDown);
        
        return () => { 
            document.removeEventListener('mousedown', handleGlobalClick, true); 
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // ==========================================
    // 🛠️ EDIT PANEL & TOOLBAR FUNCTIONS
    // ==========================================
    const closeEditPanel = () => {
        const currentSelected = selectedOverlayRef.current;
        if (currentSelected && currentSelected.id && chartRef.current) {
            const currentConfig = drawingConfigRef.current;
            chartRef.current.overrideOverlay({ 
                id: currentSelected.id, groupId: currentSelected.id,
                extendData: { 
                    fillHex: currentConfig.fillColor, borderHex: currentConfig.borderColor, 
                    lineWidth: Number(currentConfig.lineWidth), fillOpacity: Number(currentConfig.fillOpacity), 
                    borderOpacity: Number(currentConfig.borderOpacity), text: currentConfig.text, 
                    textColor: currentConfig.textColor, textSize: currentConfig.textSize, isSelected: false 
                } 
            });
        }
        setSelectedOverlay(null);
        setActiveColorPicker(null);
    };

    const duplicateOverlay = (overlayData, applyOffset = false) => {
        const sourcePoints = overlayData.points || (overlayData.extendData?.customPoints);
        if (!chartRef.current || !overlayData || !sourcePoints) return;

        const newIsolatedId = `shape_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
        let finalPoints = sourcePoints;
        
        if (applyOffset) {
            finalPoints = finalPoints.map(p => {
                const offsetPoint = { ...p };
                if (offsetPoint.timestamp) offsetPoint.timestamp += (10 * 60 * 1000); 
                if (offsetPoint.dataIndex !== undefined) offsetPoint.dataIndex += 2;
                return offsetPoint;
            });
        }

        chartRef.current.createOverlay({
            name: overlayData.name, id: newIsolatedId, groupId: newIsolatedId,
            extendData: { ...overlayData.extendData, isSelected: false, customPoints: finalPoints }, 
            styles: overlayData.styles, points: finalPoints,
            onDrawEnd: function (event) {
                if (event && event.overlay && event.overlay.points) {
                    const ext = event.overlay.extendData || {};
                    chartRef.current.overrideOverlay({ id: event.overlay.id, groupId: event.overlay.id, extendData: { ...ext, customPoints: event.overlay.points } });
                    activeOverlayInstanceRef.current = event.overlay;
                }
                return true;
            },
            onPressedMoveEnd: function (event) {
                if (event && event.overlay && event.overlay.points) {
                    const ext = event.overlay.extendData || {};
                    chartRef.current.overrideOverlay({ id: event.overlay.id, groupId: event.overlay.id, extendData: { ...ext, customPoints: event.overlay.points } });
                    activeOverlayInstanceRef.current = event.overlay;
                }
                return false;
            },
            onRightClick: function (event) { event.preventDefault(); return false; },
            onRemoved: function (event) {
                if (selectedOverlayRef.current?.id === event.overlay.id) {
                    setSelectedOverlay(null); setActiveColorPicker(null); activeOverlayInstanceRef.current = null;
                }
            },
            onClick: function (event) {
                isOverlayClickedRef.current = true; 
                if (event && event.overlay) {
                    if (!event.overlay.points && event.overlay.extendData?.customPoints) {
                        event.overlay.points = event.overlay.extendData.customPoints;
                    }
                    activeOverlayInstanceRef.current = event.overlay; 
                    setSelectedOverlay({ id: event.overlay.id, name: event.overlay.name });
                    setActiveColorPicker(event.overlay.name === 'rect' ? 'text' : null);
                    
                    const ext = event.overlay.extendData || {};
                    chartRef.current.overrideOverlay({ id: event.overlay.id, groupId: event.overlay.id, extendData: { ...ext, isSelected: true } });
                    setDrawingConfig({
                        fillColor: ext.fillHex || '#2962FF', borderColor: ext.borderHex || '#2962FF', lineWidth: ext.lineWidth || 2,
                        fillOpacity: ext.fillOpacity !== undefined ? ext.fillOpacity : 0.2, borderOpacity: ext.borderOpacity !== undefined ? ext.borderOpacity : 1,
                        text: ext.text || '', textColor: ext.textColor || '#2962FF', textSize: ext.textSize || 14
                    });
                }
                return true; 
            }
        });
    };

    const pasteActiveOverlay = () => {
        const copiedDataStr = localStorage.getItem('tradeMaster_copiedShape');
        if (copiedDataStr && chartRef.current) {
            duplicateOverlay(JSON.parse(copiedDataStr), true); 
        }
    };

    const handleToolClick = (toolId) => {
        setActiveTool(toolId);
        setSelectedOverlay(null); 
        setActiveColorPicker(null);
        setDrawingConfig(prev => ({ ...prev, text: '' }));

        if (!chartRef.current) return;
        
        if (toolId === 'cursor') { } 
        else if (toolId === 'clear') { 
            chartRef.current.removeOverlay(); 
            setActiveTool('cursor'); 
        } 
        else {
            const isolatedId = `shape_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
            chartRef.current.createOverlay({ 
                name: toolId, id: isolatedId, groupId: isolatedId, 
                extendData: {
                    fillHex: drawingConfig.fillColor, borderHex: drawingConfig.borderColor, lineWidth: Number(drawingConfig.lineWidth),
                    fillOpacity: Number(drawingConfig.fillOpacity), borderOpacity: Number(drawingConfig.borderOpacity),
                    text: '', textColor: drawingConfig.textColor, textSize: drawingConfig.textSize, isSelected: false,
                    customPoints: null, fibSettings: typeof fibSettings !== 'undefined' ? fibSettings : null 
                },
                styles: { line: { color: hexToRgba(drawingConfig.borderColor, drawingConfig.borderOpacity), size: Number(drawingConfig.lineWidth) } },
                onDrawEnd: function (event) { 
                    if (event && event.overlay) {
                        const overlay = event.overlay;
                        const ext = overlay.extendData || {};
                        
                        if (overlay.points) {
                            chartRef.current.overrideOverlay({ id: overlay.id, groupId: overlay.id, extendData: { ...ext, customPoints: overlay.points } });
                            activeOverlayInstanceRef.current = overlay;
                        }

                        if (overlay.name === 'text') {
                            selectedOverlayRef.current = overlay;
                            setSelectedOverlay(overlay);
                            setDrawingConfig({
                                text: ext.text || 'Text', textColor: ext.textColor || '#2962FF', textSize: ext.textSize || 14,
                                showBackground: ext.showBackground !== undefined ? ext.showBackground : true,
                                showBorder: ext.showBorder !== undefined ? ext.showBorder : true,
                                fillColor: ext.fillColor || '#2962FF', borderColor: ext.borderColor || '#2962FF',
                            });
                            setShowSettingsModal(true); 
                            setActiveColorPicker(null); 
                        }
                    }
                    setActiveTool('cursor'); 
                    return true; 
                },
                onPressedMoveEnd: function (event) {
                    if (event && event.overlay && event.overlay.points) {
                        const ext = event.overlay.extendData || {};
                        chartRef.current.overrideOverlay({ id: event.overlay.id, groupId: event.overlay.id, extendData: { ...ext, customPoints: event.overlay.points } });
                        activeOverlayInstanceRef.current = event.overlay;
                    }
                    return false;
                },
                onRightClick: function (event) { event.preventDefault(); return false; },
                onRemoved: function (event) {
                    if (selectedOverlayRef.current?.id === event.overlay.id) {
                        setSelectedOverlay(null); setActiveColorPicker(null); activeOverlayInstanceRef.current = null;
                    }
                },
                onClick: function (event) {
                    isOverlayClickedRef.current = true; 
                    if (event && event.overlay) {
                        if (!event.overlay.points && event.overlay.extendData?.customPoints) {
                            event.overlay.points = event.overlay.extendData.customPoints;
                        }
                        activeOverlayInstanceRef.current = event.overlay;
                        setSelectedOverlay({ id: event.overlay.id, name: event.overlay.name });
                        
                        setActiveColorPicker(event.overlay.name === 'rect' ? 'text' : null);
                        const ext = event.overlay.extendData || {};
                        
                        chartRef.current.overrideOverlay({ id: event.overlay.id, groupId: event.overlay.id, extendData: { ...ext, isSelected: true } });
                        if (ext.fibSettings) setFibSettings(ext.fibSettings);

                        setDrawingConfig({
                            fillColor: ext.fillHex || '#2962FF', borderColor: ext.borderHex || '#2962FF', lineWidth: ext.lineWidth || 2,
                            fillOpacity: ext.fillOpacity !== undefined ? ext.fillOpacity : 0.2, borderOpacity: ext.borderOpacity !== undefined ? ext.borderOpacity : 1,
                            text: ext.text || '', textColor: ext.textColor || '#2962FF', textSize: ext.textSize || 14
                        });
                    }
                    return true; 
                }
            });
        }
    };

    const updateOverlayStyle = (type, value) => {
        if (!selectedOverlay || !selectedOverlay.id || !chartRef.current) return;
        const newConfig = { ...drawingConfig, [type]: value };
        setDrawingConfig(newConfig);

        const { id, name } = selectedOverlay;
        if (name === 'rect' || name === 'circle' || name === 'text' || name === 'horizontalLine') {
            chartRef.current.overrideOverlay({ 
                id, groupId: id, 
                extendData: {
                    fillHex: newConfig.fillColor, borderHex: newConfig.borderColor, lineWidth: Number(newConfig.lineWidth),
                    fillOpacity: Number(newConfig.fillOpacity), borderOpacity: Number(newConfig.borderOpacity),
                    text: newConfig.text, textColor: newConfig.textColor, textSize: newConfig.textSize,
                    showBackground: newConfig.showBackground, showBorder: newConfig.showBorder,
                    fillColor: newConfig.fillColor, borderColor: newConfig.borderColor, isSelected: true
                }
            });
        } else {
            chartRef.current.overrideOverlay({ id, groupId: id, styles: { line: { color: hexToRgba(newConfig.borderColor, newConfig.borderOpacity), size: Number(newConfig.lineWidth) } } });
        }
    };

    const deleteActiveOverlay = () => {
        if (selectedOverlay && typeof selectedOverlay.id === 'string' && chartRef.current) {
            chartRef.current.removeOverlay({ id: selectedOverlay.id });
            setSelectedOverlay(null);
            setActiveColorPicker(null);
        }
    };

    const cloneActiveOverlay = () => {
        if (!selectedOverlay || !chartRef.current) return;
        const overlayInfo = activeOverlayInstanceRef.current; 
        if (overlayInfo && overlayInfo.id === selectedOverlay.id) {
            duplicateOverlay(overlayInfo, true); 
            closeEditPanel();
        }
    };

    const copyActiveOverlay = () => {
        if (!selectedOverlay || !chartRef.current) return;
        const overlayInfo = activeOverlayInstanceRef.current; 
        if (overlayInfo && overlayInfo.id === selectedOverlay.id) {
            localStorage.setItem('tradeMaster_copiedShape', JSON.stringify({
                name: overlayInfo.name, extendData: { ...overlayInfo.extendData, isSelected: false },
                styles: overlayInfo.styles, points: overlayInfo.points
            }));
            closeEditPanel();
        }
    };

    const hideActiveOverlay = () => {
        if (!selectedOverlay || !chartRef.current) return;
        chartRef.current.overrideOverlay({ id: selectedOverlay.id, groupId: selectedOverlay.id, visible: false });
        closeEditPanel();
    };

    const applySettingsToChart = () => {
        if (!selectedOverlay || !chartRef.current) return;
        const { name: overlayName, id: overlayId } = selectedOverlay;

        if (overlayName === 'customFib') {
            chartRef.current.overrideOverlay({
                id: overlayId, groupId: overlayId,
                extendData: { ...selectedOverlay.extendData, fibSettings: fibSettings },
                styles: { line: { color: fibSettings.trendLine.color, style: fibSettings.trendLine.style } }
            });
        } else {
            chartRef.current.overrideOverlay({
                id: overlayId, groupId: overlayId,
                extendData: {
                    fillHex: drawingConfig.fillColor, borderHex: drawingConfig.borderColor, lineWidth: Number(drawingConfig.lineWidth),
                    fillOpacity: Number(drawingConfig.fillOpacity), borderOpacity: Number(drawingConfig.borderOpacity),
                    text: drawingConfig.text, textColor: drawingConfig.textColor, textSize: drawingConfig.textSize,
                    showBackground: drawingConfig.showBackground, showBorder: drawingConfig.showBorder,
                    fillColor: drawingConfig.fillColor, borderColor: drawingConfig.borderColor, isSelected: true
                }
            });
        }
        setShowSettingsModal(false);
    };

    // ==========================================
    // ⚡ LIVE PREVIEW EFFECT (TradingView Style)
    // ==========================================
    useEffect(() => {
        // जब सेटिंग्स मोडल खुला हो, तब हर बदलाव को सीधा चार्ट पर अप्लाई करें
        if (showSettingsModal && selectedOverlay && chartRef.current) {
            
            const currentExtData = activeOverlayInstanceRef.current?.extendData || {};
            
            chartRef.current.overrideOverlay({
                id: selectedOverlay.id,
                groupId: selectedOverlay.id,
                extendData: { 
                    ...currentExtData, 
                    fibSettings: fibSettings 
                }
            });
        }
    }, [fibSettings, showSettingsModal, selectedOverlay, chartRef]);

    return {
        activeTool, setActiveTool,
        selectedOverlay, setSelectedOverlay,
        activeColorPicker, setActiveColorPicker,
        showSettingsModal, setShowSettingsModal,
        fibSettings, setFibSettings,
        drawingConfig, setDrawingConfig,
        handleToolClick, updateOverlayStyle, deleteActiveOverlay, 
        cloneActiveOverlay, copyActiveOverlay, hideActiveOverlay, 
        applySettingsToChart, closeEditPanel
    };
};