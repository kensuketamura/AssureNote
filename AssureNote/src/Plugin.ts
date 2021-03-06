// ***************************************************************************
// Copyright (c) 2014, AssureNote project authors. All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
// *  Redistributions of source code must retain the above copyright notice,
//    this list of conditions and the following disclaimer.
// *  Redistributions in binary form must reproduce the above copyright
//    notice, this list of conditions and the following disclaimer in the
//    documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
// TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
// PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
// EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
// OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
// OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
// ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
// **************************************************************************

///<reference path="./NodeMenu.ts" />
///<reference path='../d.ts/jquery.d.ts'/>

module AssureNote {

    export class Plugin {
        private hasMenuBarButton: boolean;
        private hasEditor: boolean;
        private hasDoubleClicked: boolean;

        constructor() {
            this.hasMenuBarButton = false;
            this.hasEditor = false;
            this.hasDoubleClicked = false;
        }

        Display(PluginPanel: WGSNEditorPanel, GSNDoc: GSNDoc, Label: string): void {
        }

        OnNodeDoubleClicked(NodeView: NodeView): void {
        }

        CreateMenuBarButton(NodeView: NodeView): NodeMenuItem {
            return null;
        }

        CreateMenuBarButtons(NodeView: NodeView): NodeMenuItem[] {
            return null;
        }

        CreateTooltipContents(NodeView: NodeView): HTMLLIElement[] {
            return null;
        }

        RenderHTML(NodeDoc: string, Model: GSNNode): string {
            /* Do nothing */
            return NodeDoc;
        }

        RenderSVG(ShapeGroup: SVGGElement, NodeView: NodeView): void {
            /* Do nothing */
        }

        SetHasMenuBarButton(b: boolean) {
            this.hasMenuBarButton = b;
        }

        HasMenuBarButton() : boolean {
            return this.hasMenuBarButton;
        }

        SetHasEditor(b: boolean): void {
            this.hasEditor = b;
        }

        HasEditor(): boolean {
            return this.hasEditor;
        }

        SetHasDoubleClicked(b: boolean): void {
            this.hasDoubleClicked = b;
        }

        HasDoubleClicked(): boolean {
            return this.hasDoubleClicked;
        }
    }

    export function OnLoadPlugin(Callback: (App: AssureNoteApp) => void) {
        PluginManager.OnLoadPlugin.push(Callback);
        if (PluginManager.Current != null) {
            PluginManager.Current.LoadPlugin();
        }
    }

    export class PluginManager {
        private PluginMap: {[index: string]: Plugin};
        constructor(public AssureNoteApp: AssureNoteApp) {
            this.PluginMap = {};
            PluginManager.Current = this;
        }

        static Current: PluginManager;

        static OnLoadPlugin: Array<(App: AssureNoteApp) => void> = [];

        LoadPlugin() {
            for (var i = 0; i < PluginManager.OnLoadPlugin.length; i++) {
                PluginManager.OnLoadPlugin[i](this.AssureNoteApp);
            }
            PluginManager.OnLoadPlugin = [];
        }

        SetPlugin(Name: string, Plugin: Plugin): void {
            if (!this.PluginMap[Name]) {
                this.PluginMap[Name] = Plugin;
            } else {
                this.AssureNoteApp.DebugP("Plugin " + name + " already defined.");
            }
        }

        GetPanelPlugin(Name: string, Label?: string): Plugin {
            //TODO change plugin by Label
            return this.PluginMap[Name];
        }

        GetCommandPlugin(Name: string): Plugin {
            return this.PluginMap[Name];
        }

        GetMenuBarButtons(TargetView: NodeView): NodeMenuItem[]{
            var ret: NodeMenuItem[] = [];
            $.each(this.PluginMap, (key, value: Plugin) => {
                if (value.HasMenuBarButton()) {
                    this.AssureNoteApp.DebugP("Menu: key=" + key);
                    var Button = value.CreateMenuBarButton(TargetView);
                    if (Button != null) {
                        ret.push(Button);
                    }
                    var Buttons = value.CreateMenuBarButtons(TargetView);
                    if (Buttons != null) {
                        ret = ret.concat(Buttons);
                    }
                }
            });
            return ret;
        }

        GetTooltipContents(TargetView: NodeView): HTMLLIElement[]{
            var ret: HTMLLIElement[] = [];
            $.each(this.PluginMap, (key, value: Plugin) => {
                var Tooltip = value.CreateTooltipContents(TargetView);
                if (Tooltip) ret = ret.concat(Tooltip);
            });
            return ret;
        }

        GetDoubleClicked(): Plugin[] {
            var ret: Plugin[] = [];
            //FIXME Editing mode
            $.each(this.PluginMap, (key, value: Plugin) => {
                if (value.HasDoubleClicked()) {
                    ret.push(value);
                }
            });
            return ret;
        }

        InvokeHTMLRenderPlugin(NodeDoc: string, Model: GSNNode): string {
            $.each(this.PluginMap, (key: string, value: Plugin) => {
                NodeDoc = value.RenderHTML(NodeDoc, Model);
            });
            return NodeDoc;
        }

        InvokeSVGRenderPlugin(ShapeGroup: SVGGElement, NodeView: NodeView): void {
            $.each(this.PluginMap, (key: string, value: Plugin) => {
                value.RenderSVG(ShapeGroup, NodeView);
            });
        }
    }
}

