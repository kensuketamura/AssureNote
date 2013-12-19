
module AssureNote {
	export class LayoutEngine {
		constructor(public AssureNoteApp: AssureNoteApp) {
		}

		//FIXME Rename
		DoLayout(PictgramPanel: PictgramPanel, NodeView: NodeView): void {
			//TODO
		}
	}

	
	export class SimpleLayoutEngine extends LayoutEngine {
        static ContextHorizontalMargin = 32;
        static ContextVerticalMargin = 10;
        static ChildrenVerticalMargin = 64;
        static ChildrenHorizontalMargin = 12;

        constructor(public AssureNoteApp: AssureNoteApp) {
			super(AssureNoteApp);
		}

        private Render(ThisNode: NodeView, DivFrag: DocumentFragment, SvgNodeFrag: DocumentFragment, SvgConnectionFrag: DocumentFragment): void {
            if (ThisNode.IsVisible) {
                ThisNode.GetShape().PrerenderContent(this.AssureNoteApp.PluginManager);
                ThisNode.Render(DivFrag, SvgNodeFrag, SvgConnectionFrag);
                if (!ThisNode.IsFolded) {
                    ThisNode.ForEachVisibleAllSubNodes((SubNode: NodeView) => {
                        this.Render(SubNode, DivFrag, SvgNodeFrag, SvgConnectionFrag);
                    });
                }
            }
        }

		DoLayout(PictgramPanel: PictgramPanel, NodeView: NodeView): void {

			var DivFragment = document.createDocumentFragment();
			var SvgNodeFragment = document.createDocumentFragment();
			var SvgConnectionFragment = document.createDocumentFragment();

            this.Render(NodeView, DivFragment, SvgNodeFragment, SvgConnectionFragment);

			PictgramPanel.ContentLayer.appendChild(DivFragment);
			PictgramPanel.SVGLayer.appendChild(SvgConnectionFragment);
            PictgramPanel.SVGLayer.appendChild(SvgNodeFragment);

            this.Layout(NodeView);
		}

		private Layout(ThisNode: NodeView): void {
            if (!ThisNode.IsVisible) {
                return;
            }
            var Shape = ThisNode.GetShape();
            Shape.FitSizeToContent();
            var TreeLeftX = 0;
            var ThisNodeWidth = Shape.GetNodeWidth();
            var TreeRightX = ThisNodeWidth;
            var TreeHeight = Shape.GetNodeHeight();
            if (ThisNode.IsFolded) {
                Shape.SetHeadSize(ThisNodeWidth, TreeHeight);
                Shape.SetTreeSize(ThisNodeWidth, TreeHeight);
                Shape.SetHeadUpperLeft(0, 0);
                Shape.SetTreeUpperLeft(0, 0);
                return;
            }
			if (ThisNode.Left != null) {
				var LeftNodesWidth = 0;
                var LeftNodesHeight = -SimpleLayoutEngine.ContextVerticalMargin;
                ThisNode.ForEachVisibleLeftNodes((SubNode: NodeView) => {
                    SubNode.GetShape().FitSizeToContent();
                    LeftNodesHeight += SimpleLayoutEngine.ContextVerticalMargin;
                    SubNode.RelativeX = -(SubNode.Shape.GetNodeWidth() + SimpleLayoutEngine.ContextHorizontalMargin);
                    SubNode.RelativeY = LeftNodesHeight;
                    LeftNodesWidth = Math.max(LeftNodesWidth, SubNode.Shape.GetNodeWidth());
                    LeftNodesHeight += SubNode.Shape.GetNodeHeight();
                });
                if (LeftNodesHeight > 0) {
                    TreeLeftX = -(LeftNodesWidth + SimpleLayoutEngine.ContextHorizontalMargin);
                    TreeHeight = Math.max(TreeHeight, LeftNodesHeight);
				}
			}
			if (ThisNode.Right != null) {
				var RightNodesWidth = 0;
                var RightNodesHeight = -SimpleLayoutEngine.ContextVerticalMargin;
                ThisNode.ForEachVisibleRightNodes((SubNode: NodeView) => {
                    SubNode.GetShape().FitSizeToContent();
                    RightNodesHeight += SimpleLayoutEngine.ContextVerticalMargin;
                    SubNode.RelativeX = (ThisNodeWidth + SimpleLayoutEngine.ContextHorizontalMargin);
                    SubNode.RelativeY = RightNodesHeight;
                    RightNodesWidth = Math.max(RightNodesWidth, SubNode.Shape.GetNodeWidth());
                    RightNodesHeight += SubNode.Shape.GetNodeHeight();
                });
                if (RightNodesHeight > 0) {
                    TreeRightX += RightNodesWidth + SimpleLayoutEngine.ContextHorizontalMargin;
                    TreeHeight = Math.max(TreeHeight, RightNodesHeight);
				}
			}
            var HeadWidth = TreeRightX - TreeLeftX;
            Shape.SetHeadSize(HeadWidth, TreeHeight);
            Shape.SetHeadUpperLeft(TreeLeftX, 0);
            TreeHeight += SimpleLayoutEngine.ChildrenVerticalMargin;

            var ChildrenTopWidth = 0;
            var ChildrenBottomWidth = 0;
            var ChildrenHeight = 0;
            var FoldedNodeRun: NodeView[] = [];
            var VisibleChildrenCount = 0;
            if (ThisNode.Children != null && ThisNode.Children.length > 0) {
                var IsLastChildFolded = false;
                ThisNode.ForEachVisibleChildren((SubNode: NodeView) => {
                    VisibleChildrenCount++;
                    this.Layout(SubNode);
                    var ChildTreeWidth = SubNode.Shape.GetTreeWidth();
                    var ChildHeadWidth = SubNode.IsFolded ? SubNode.Shape.GetNodeWidth() : SubNode.Shape.GetHeadWidth();
                    var ChildHeadLeftSideMargin = -SubNode.Shape.GetTreeLeftX() + SubNode.Shape.GetHeadLeftX();
                    var ChildHeadRightX = ChildHeadLeftSideMargin + ChildHeadWidth;
                    var ChildTreeHeight = SubNode.Shape.GetTreeHeight();
                    var Margin = SimpleLayoutEngine.ChildrenHorizontalMargin;

                    var IsUndeveloped = SubNode.Children == null || SubNode.Children.length == 0;
                    var IsFoldedLike = SubNode.IsFolded || IsUndeveloped;

                    if (IsFoldedLike) {
                        SubNode.RelativeX = ChildrenTopWidth;
                        ChildrenTopWidth = ChildrenTopWidth + ChildHeadWidth + Margin;
                        FoldedNodeRun.push(SubNode);
                    } else {
                        if (IsLastChildFolded) {
                            var WidthDiff = ChildrenTopWidth - ChildrenBottomWidth;
                            if (WidthDiff < ChildHeadLeftSideMargin) {
                                SubNode.RelativeX = ChildrenBottomWidth;
                                ChildrenTopWidth = ChildrenBottomWidth + ChildHeadRightX + Margin;
                                ChildrenBottomWidth = ChildrenBottomWidth + ChildTreeWidth + Margin;
                                if (SubNode.RelativeX == 0) {
                                    for (var i = 0; i < FoldedNodeRun.length; i++) {
                                        FoldedNodeRun[i].RelativeX += ChildHeadLeftSideMargin - WidthDiff;
                                    }
                                } else {
                                    var FoldedRunMargin = (ChildHeadLeftSideMargin - WidthDiff) / (FoldedNodeRun.length + 1)
                                    for (var i = 0; i < FoldedNodeRun.length; i++) {
                                        FoldedNodeRun[i].RelativeX += FoldedRunMargin * (i + 1);
                                    }
                                }
                            } else {
                                SubNode.RelativeX = ChildrenTopWidth - ChildHeadLeftSideMargin;
                                ChildrenBottomWidth = ChildrenTopWidth + ChildTreeWidth - ChildHeadLeftSideMargin + Margin;
                                ChildrenTopWidth = ChildrenTopWidth + ChildHeadWidth + Margin;
                            }
                        } else {
                            var ChildrenWidth = Math.max(ChildrenTopWidth, ChildrenBottomWidth);
                            SubNode.RelativeX = ChildrenWidth;
                            ChildrenTopWidth = ChildrenWidth + ChildHeadRightX + Margin;
                            ChildrenBottomWidth = ChildrenWidth + ChildTreeWidth + Margin;
                        }
                        FoldedNodeRun = [];
                        SubNode.RelativeX += -SubNode.Shape.GetTreeLeftX();
                    }
                    SubNode.RelativeY = TreeHeight;

                    IsLastChildFolded = IsFoldedLike;
                    ChildrenHeight = Math.max(ChildrenHeight, ChildTreeHeight);
                    //console.log("T" + ChildrenTopWidth + ", B" + ChildrenBottomWidth);
                });

                var ChildrenWidth = Math.max(ChildrenTopWidth, ChildrenBottomWidth) - SimpleLayoutEngine.ChildrenHorizontalMargin;
                var Shift = (ChildrenWidth - ThisNodeWidth) / 2;
                if (VisibleChildrenCount == 1) {
                    ThisNode.ForEachVisibleChildren((SubNode: NodeView) => {
                        Shift = -SubNode.Shape.GetTreeLeftX();
                    });
                }
                TreeLeftX = Math.min(TreeLeftX, -Shift);
                ThisNode.ForEachVisibleChildren((SubNode: NodeView) => {
                    SubNode.RelativeX -= Shift;
                });

                TreeHeight += ChildrenHeight;
                TreeRightX= Math.max(ChildrenWidth, HeadWidth);
            }
            Shape.SetTreeUpperLeft(TreeLeftX, 0);
            Shape.SetTreeSize(TreeRightX, TreeHeight);
            //console.log(ThisNode.Label + ": " + (<any>ThisNode.Shape).TreeBoundingBox.toString());
		}

	}

}