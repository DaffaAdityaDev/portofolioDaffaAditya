import React from 'react';
import { ARCHITECTURE_NODES } from '../constants';

const NODES = Object.values(ARCHITECTURE_NODES);

/** The components of the architecture as a table, from the same data as the diagram. */
const ComponentTable: React.FC = () => (
  <table>
    <thead>
      <tr>
        <th>Component</th>
        <th>What it does</th>
      </tr>
    </thead>
    <tbody>
      {NODES.map((node) => (
        <tr key={node.name}>
          <td>{node.name}</td>
          <td>{node.description}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default ComponentTable;
