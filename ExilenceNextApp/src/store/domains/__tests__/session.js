/* eslint-disable no-undef */
const { mergeFromDiffSnapshotStashTabs } = require('../../../utils/snapshot.utils');
// import { mergeFromDiffSnapshotStashTabs } from '../../../utils/snapshot.utils';

expect.extend({
  toContainObject(received, argument) {
    const pass = this.equals(received, expect.arrayContaining([expect.objectContaining(argument)]));

    const shotReceived = received.map((r) => ({ name: r.name, stackSize: r.stackSize || 0 }));

    if (pass) {
      return {
        message: () =>
          `expected ${this.utils.printReceived(
            shotReceived
          )} not to contain object ${this.utils.printExpected(argument)}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${this.utils.printReceived(
            shotReceived
          )}\nTo contain object ${this.utils.printExpected(argument)}`,
        pass: false,
      };
    }
  },
});

// eslint-disable-next-line no-undef
test('Save new snapshot after being active again', () => {
  const sessionStartSnapshot = {
    stashTabs: [
      {
        stashTabId: 'O',
        pricedItems: [
          {
            name: 'Orb of Scouring',
            calculated: 0.5,
            total: 15,
            stackSize: 30,
            typeLine: 'XXX',
          },
          {
            name: 'Orb of Fusing',
            calculated: 0.5,
            total: 10,
            stackSize: 20,
            typeLine: 'XXX',
          },
          {
            name: 'Divine Orb',
            calculated: 150,
            total: 750,
            stackSize: 5,
            typeLine: 'XXX',
          },
        ],
      },
    ],
  };

  const newSnapshotToAdd = {
    stashTabs: [
      {
        stashTabId: 'O',
        pricedItems: [
          {
            name: 'Orb of Scouring',
            calculated: 0.5,
            total: 12.5,
            stackSize: 25, // Removed 5
            typeLine: 'XXX',
          },
          {
            name: 'Jeweller Orb',
            calculated: 0.1,
            total: 1.5,
            stackSize: 15, // Removed 5
            typeLine: 'XXX',
          },
          {
            name: 'Chaos Orb',
            calculated: 1,
            total: 10,
            stackSize: 10, // Added 10
            typeLine: 'XXX',
          },
          {
            name: 'Orb of Fusing',
            calculated: 0.5,
            total: 5,
            stackSize: 30, // Added 25
            typeLine: 'XXX',
          },
          //   {
          //     name: 'Awakened Sextant',
          //     calculated: 4,
          //     total: 0, // Removed 10
          //     stackSize: 0,
          //     typeLine: 'XXX',
          //   },
          {
            name: 'Divine Orb',
            calculated: 150,
            total: 750,
            stackSize: 5, // Did nothing
            typeLine: 'XXX',
          },
        ],
      },
    ],
  };

  const diffSnapshotBeforeInactiv = {
    stashTabs: [
      {
        stashTabId: 'O',
        pricedItems: [
          {
            name: 'Awakened Sextant',
            calculated: 4,
            total: 40,
            stackSize: 10, // Added 10; Total 10
            typeLine: 'XXX',
          },
          {
            name: 'Jeweller Orb',
            calculated: 0.1,
            total: 2,
            stackSize: 20, // Added 20; Total 20
            typeLine: 'XXX',
          },
          {
            name: 'Orb of Fusing',
            calculated: 0.5,
            total: -7.5,
            stackSize: -15, // Removed 15 ; Total => 5
            typeLine: 'XXX',
          },
        ],
      },
    ],
  };

  let diffSnapshot = mergeFromDiffSnapshotStashTabs(sessionStartSnapshot, newSnapshotToAdd, true);

  diffSnapshot.stashTabs.forEach((s) => {
    expect(s.pricedItems).toContainObject({ name: 'Orb of Scouring', stackSize: -5 });
    expect(s.pricedItems).toContainObject({ name: 'Jeweller Orb', stackSize: 15 });
    expect(s.pricedItems).toContainObject({ name: 'Chaos Orb', stackSize: 10 });
    expect(s.pricedItems).toContainObject({ name: 'Orb of Fusing', stackSize: 10 });
    expect(s.pricedItems).not.toContainObject({ name: 'Divine Orb' });
  });

  // First snapshot after the profile is activ again - remove the diffitems while inactiv
  const diffSnapshotWhileInactiv = mergeFromDiffSnapshotStashTabs(
    diffSnapshotBeforeInactiv, // Snapshot before inactiv
    diffSnapshot, // Snapshot after inactiv
    true
  );

  diffSnapshotWhileInactiv.stashTabs.forEach((s) => {
    expect(s.pricedItems).toContainObject({ name: 'Orb of Scouring', stackSize: -5 });
    expect(s.pricedItems).toContainObject({ name: 'Jeweller Orb', stackSize: -5 });
    expect(s.pricedItems).toContainObject({ name: 'Chaos Orb', stackSize: 10 });
    expect(s.pricedItems).toContainObject({ name: 'Awakened Sextant', stackSize: -10 });
    expect(s.pricedItems).toContainObject({ name: 'Orb of Fusing', stackSize: 25 });
    expect(s.pricedItems).not.toContainObject({ name: 'Divine Orb' });
  });

  // Calculate the new sessionStartSnapshot. The diffitems will be added to remove them for new snapshots

  const newSessionStartSnapshot = mergeFromDiffSnapshotStashTabs(
    sessionStartSnapshot,
    diffSnapshotWhileInactiv,
    true,
    undefined,
    true
  );

  newSessionStartSnapshot.stashTabs.forEach((s) => {
    // Diff -5; Target: 0; => 30 (old current) -5 (diff) = 25 (new current)
    // => 25 (new Snapshot) - 25 (new current) = 0 (Taget)
    expect(s.pricedItems).toContainObject({ name: 'Orb of Scouring', stackSize: 25 });
    // Diff +10; Target: 0; => 0 (old current) +10 (diff) = 10 (new current)
    // => 10 (new Snapshot) - 10 (new current) = 0 (Taget)
    expect(s.pricedItems).toContainObject({ name: 'Chaos Orb', stackSize: 10 }); // Add value while inactiv (10 added, Total 10)
    // Diff -5; Target: 20; => 0 (old current) -5 (diff) = -5 (new current)
    // => 15 (new Snapshot) - (-5) (new current) = 20 (Taget)
    expect(s.pricedItems).toContainObject({ name: 'Jeweller Orb', stackSize: -5 }); // Remove value while inactiv (5 removed; Total 15)
    // Diff -10; Target: 10; => 0 (old current) -10 (diff) = -10 (new current)
    // => 0 (new Snapshot) - -(10) (new current) = 10 (Taget)
    expect(s.pricedItems).toContainObject({ name: 'Awakened Sextant', stackSize: -10 }); // Remove value while inactiv (10 removed; Total 0)
    // Diff 25; Target: -15; => 20 (old current) +25 (diff) = 45 (new current)
    // => 30 (new Snapshot) - 45 (new current) = -15 (Taget)
    expect(s.pricedItems).toContainObject({ name: 'Orb of Fusing', stackSize: 45 }); // Remove value while inactiv
    // Diff 0; Target: 0; => 5 (old current) +0 (diff) = 5 (new current)
    // => 5 (new Snapshot) - 5 (new current) = 0 (Taget)
    expect(s.pricedItems).toContainObject({ name: 'Divine Orb', stackSize: 5 });
  });

  // The sessionStartSnapshot is updated, now recalculate the diffSnapshot
  diffSnapshot = mergeFromDiffSnapshotStashTabs(newSessionStartSnapshot, newSnapshotToAdd, true);

  // Remove influence completly
  diffSnapshot.stashTabs.forEach((s) => {
    expect(s.pricedItems).not.toContainObject({ name: 'Orb of Scouring' }); // No Scoring
    expect(s.pricedItems).toContainObject({ name: 'Jeweller Orb', stackSize: 20 }); // Diff before inactiv
    expect(s.pricedItems).not.toContainObject({ name: 'Chaos Orb' }); // No Chaos
    expect(s.pricedItems).toContainObject({ name: 'Awakened Sextant', stackSize: 10 }); // Diff before inactiv
    expect(s.pricedItems).toContainObject({ name: 'Orb of Fusing', stackSize: -15 }); // Diff before inactiv
    expect(s.pricedItems).not.toContainObject({ name: 'Divine Orb' }); // No Divine - no changes at all
  });
});
