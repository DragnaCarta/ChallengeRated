import React from 'react';
import ButtonGrid from '@/components/ButtonGrid/ButtonGrid';
import ButtonToggle from '@/components/ButtonToggle/ButtonToggle';
import Card from '@/components/Card/Card'
import CardTitle from '@/components/CardTitle/CardTitle';
import ChallengeRatingOptions from '@/lib/ChallengeRatingOptions';
import CreatureToggleOptions from '@/lib/CreatureToggleOptions';
import RefreshIcon from '@/components/RefreshIcon/RefreshIcon';

import styles from './CardBuildYourEncounter.module.css'

type CardBuildYourEncounterProps = {
    addCreature: (value: number) => void;
    creatureToggle: number;
    setCreatureToggle: (value: number) => void;
    enemies: number[];
    addEnemy: (value: number) => void;
    setEnemies: (value: number[]) => void;
    allies: number[];
    setAllies: (value: number[]) => void;
}

function CardBuildYourEncounter({ 
    addCreature,
    creatureToggle, 
    setCreatureToggle,
    enemies,
    setEnemies,
    allies,
    setAllies,
}: CardBuildYourEncounterProps
    ) {

    function addAlly(challengeRating: number) {
        setAllies([...allies, challengeRating]);
        }
    
        function removeAlly(challengeRating: number) {
        const index = allies.indexOf(challengeRating);
        if (index > -1) {
            allies.splice(index, 1);
            setAllies([...allies]);
        }
        }
    
        function addEnemy(challengeRating: number) {
        setEnemies([...enemies, challengeRating]);
        }
    
        function removeEnemy(challengeRating: number) {
        const index = enemies.indexOf(challengeRating);
        if (index > -1) {
            enemies.splice(index, 1);
            setEnemies([...enemies]);
        }
        }

    //
    const enemyCrOccurrences = enemies.reduce(function (acc: Record<number, number>, curr) {
        return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});

    const allyCrOccurrences = allies.reduce(function (acc: Record<number, number>, curr) {
        return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    
    return(
        <Card>
            <CardTitle>
                <div className={styles.cardTitleContainer}>
                    <h2>Build Your Encounter</h2>
                    <button
                        className={styles.reset}
                        onClick={() => {
                            setEnemies([]);
                            setAllies([]);
                        }}
                    >
                        <RefreshIcon />
                    </button>
                </div>
            </CardTitle>
          <div style={{ margin: '1rem' }}>
            <ButtonToggle 
              label="Are you adding allies or enemies?"
              options={CreatureToggleOptions}
              selectedValue={creatureToggle}
              onClick={(value: number) => setCreatureToggle(value)}
            />
          </div>
          <div style={{ margin: '1rem' }}>
            <ButtonGrid 
              label="Add creatures that will fight in this encounter by selecting their Challenge Ratings."
              options={ChallengeRatingOptions}
              onClick={(value: number) => addCreature(value)}
              mode={creatureToggle === 0 ? 'red' : 'blue'}
            />
          </div>

          <div style={{ margin: '1rem' }}>
            <EnemiesList
                enemyCrOccurrences={enemyCrOccurrences}
                addEnemy={addEnemy}
                removeEnemy={removeEnemy}
            />
            <AlliesList
                allyCrOccurrences={allyCrOccurrences}
                addAlly={addAlly}
                removeAlly={removeAlly}
            />
          </div>
        </Card>
  );
}

type EnemiesListProps = {
    enemyCrOccurrences: Record<number, number>;
    addEnemy: (value: number) => void;
    removeEnemy: (value: number) => void;
}

function EnemiesList({ enemyCrOccurrences, addEnemy, removeEnemy }: EnemiesListProps) {
    return (
        <>
            <p style={{ fontWeight: '700'}}>Enemies:</p>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
            {Object.keys(enemyCrOccurrences)
                .map(x => parseFloat(x))
                .sort(_numberSort)
                .map((cr) => 
                {
                const crCount = enemyCrOccurrences[cr];
                return (
                    <CreatureListItem
                        key={cr}
                        challengeRating={cr}
                        count={crCount}
                        increaseCount={(cr) => addEnemy(cr)}
                        decreaseCount={(cr) => removeEnemy(cr)}
                    />
                )
                }
            )}
            </div>
        </>
    )
}

type AlliesListProps = {
    allyCrOccurrences: Record<number, number>;
    addAlly: (value: number) => void;
    removeAlly: (value: number) => void;
}

function AlliesList({ allyCrOccurrences, addAlly, removeAlly }: AlliesListProps) {
    return (
        <>
            <p style={{ fontWeight: '700'}}>Allies:</p>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {Object.keys(allyCrOccurrences)
                .map(x => parseFloat(x))
                .sort(_numberSort)
                .map((cr) => 
                {
                  const crCount = allyCrOccurrences[cr];
                  return (
                    <CreatureListItem
                      key={cr}
                      challengeRating={cr}
                      count={crCount}
                      increaseCount={(cr) => addAlly(cr)}
                      decreaseCount={(cr) => removeAlly(cr)}
                    />
                  )
                }
              )}
            </div>
        </>
    )
}

type CreatureListItemProps = {
    challengeRating: number;
    count: number;
    increaseCount: (challengeRating: number) => void;
    decreaseCount: (challengeRating: number) => void;
  }
  
  function CreatureListItem({ challengeRating, count, increaseCount, decreaseCount }: CreatureListItemProps) {
    return (
      <div 
        style={{ 
          display: 'flex',
          background: 'white',
          padding: '0.5rem',
          margin: '4px 0'
        }}>
        <h2>CR: { challengeRating }</h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 'auto'
          }}
        >
          <button 
            className={`${styles.btnChallengeRating} ${styles.decrement}`}
            onClick={() => decreaseCount(challengeRating)}
          >
            -
          </button>
          <span
            className={styles.challengeRatingCount}
          >
            { count }
          </span>
          <button 
            className={`${styles.btnChallengeRating} ${styles.increment}`}
            onClick={() => increaseCount(challengeRating)}
            >
            +
          </button>
        </div>
      </div>
    )
  }
  
  function _numberSort(a: number, b: number) {
    return a - b;
  }

export default CardBuildYourEncounter;