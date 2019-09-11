import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

import { UserService } from '../user/user.service';
import { User } from '../user/user';

interface MenuNode {
    name: string;
    icon: string;
    url?: string;
    children?: MenuNode[];
  }

  const TREE_DATA: MenuNode[] = [
    {

        name: 'Cadastros',
        icon: 'list',
        children: [
            {name: 'Cadastro de Estabelecimentos', icon: 'store', url: 'cadastros/cadastro-estabelecimentos'},
            {name: 'Cadastro de Shoppings', icon: 'local_mall', url: 'cadastros/cadastro-shoppings'},
            {name: 'Cadastro de PDVs NFCE', icon: 'desktop_windows', url: 'cadastros/cadastro-pdvs-nfce'},
        ]
    }
  ];
  interface MenuFlatNode {
    expandable: boolean;
    name: string;
    icon: string;
    url: string;
    level: number;
  }

@Component({
    selector: 'ap-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {

    user$: Observable<User>;

    private _transformer = (node: MenuNode, level: number) => {
        return {
          expandable: !!node.children && node.children.length > 0,
          name: node.name,
          icon: node.icon,
          url: node.url,
          level: level,
        };
      }
    
    treeControl = new FlatTreeControl<MenuFlatNode>(
        node => node.level, node => node.expandable);
    
    treeFlattener = new MatTreeFlattener(this._transformer, node => node.level, node => node.expandable, node => node.children);
    
    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    constructor(private userService: UserService, private router: Router) {
        this.dataSource.data = TREE_DATA;
        this.user$ = userService.getUser();
    }

    hasChild = (_: number, node: MenuFlatNode) => node.expandable;

    logout() {
        this.userService.logout();
        this.router.navigate(['']);
    }
}