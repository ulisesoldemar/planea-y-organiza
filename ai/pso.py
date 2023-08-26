import cv2
import numpy as np
import matplotlib.pyplot as plt
from find_coords import find_coords, show_solution
from save_JSON import save_JSON
from calc_distances import calc_distance
from numpy.random import rand

# Sección a trabajar
CURRENT_SECTION = 1
DISTANCE_METHOD = 'euclidean'

# Se carga imagen
I = cv2.imread(f'img/play/Seccion{CURRENT_SECTION}.png')

# Obtener límites del recuadro de la imagen
height, width, _ = I.shape
x_limit = width - 1
y_limit = height - 1

# Se obtienen coordenadas de las pelotas y de la meta
balls_coords, target_coords = find_coords(I)
target_coords = target_coords[0]

# Calculo de todas las distancias para saber la relación entre ellas
distances = {'euclidean': [], 'cityblock': []}
for i in range(5):
    I_section = cv2.imread(f'img/play/Seccion{i+1}.png')
    balls, target = find_coords(I_section)
    distances['euclidean'].append(
        calc_distance(balls, target[0], 'euclidean'))
    distances['cityblock'].append(
        calc_distance(balls, target[0], 'cityblock'))

min_distance = np.min(distances[DISTANCE_METHOD])
max_distance = np.max(distances[DISTANCE_METHOD])
diff_distance = max_distance - min_distance

section_distance = calc_distance(balls_coords, target_coords)
target_distance = section_distance + \
    (diff_distance/8)  # Suma deseada de distancias

print('Distancia original:', section_distance)
print('Distancia objetivo:', target_distance)

NUM_GENERATIONS = 5000
NUM_PARTICLES = 100
INERTIA_WEIGHT = 0.5
COGNITIVE_WEIGHT = 1.5
SOCIAL_WEIGHT = 1.5
PATTERN_WEIGHT = 100  # Peso para penalizar las diferencias del patrón original

def objective_function(population, method=DISTANCE_METHOD):
    match method:
        case 'euclidean':
            distances = np.sqrt(np.sum((population - target_coords) ** 2, axis=1))
        case 'cityblock':
            distances = np.sum(np.abs(population - target_coords), axis=1)
    pattern_difference = np.sum(np.abs(population - balls_coords), axis=1)
    return np.abs(np.sum(distances) - target_distance) + PATTERN_WEIGHT * np.sum(pattern_difference)

num_balls = len(balls_coords)
x_min = np.zeros((num_balls, 2))
x_max = np.array([[x_limit, y_limit]] * num_balls)
particles = x_min + rand(NUM_PARTICLES, num_balls, 2) * (x_max - x_min)
velocities = rand(NUM_PARTICLES, num_balls, 2) * (x_max - x_min) * 0.1
best_particle_positions = particles.copy()
best_particle_objectives = np.array([objective_function(p) for p in particles])
global_best_index = np.argmin(best_particle_objectives)
global_best_position = best_particle_positions[global_best_index].copy()
global_best_objective = best_particle_objectives[global_best_index]
best_global_objectives = []

for iteration in range(NUM_GENERATIONS):
    for i in range(NUM_PARTICLES):
        r1, r2 = rand(), rand()
        cognitive_component = COGNITIVE_WEIGHT * r1 * (best_particle_positions[i] - particles[i])
        social_component = SOCIAL_WEIGHT * r2 * (global_best_position - particles[i])
        velocities[i] = INERTIA_WEIGHT * velocities[i] + cognitive_component + social_component
        particles[i] += velocities[i]
        particles[i] = np.clip(particles[i], x_min, x_max)
        particle_objective = objective_function(particles[i])
        if particle_objective < best_particle_objectives[i]:
            best_particle_positions[i] = particles[i].copy()
            best_particle_objectives[i] = particle_objective
            if particle_objective < global_best_objective:
                global_best_position = particles[i].copy()
                global_best_objective = particle_objective

    best_global_objectives.append(global_best_objective)

# save_JSON(global_best_position, target_coords, f'json/predicted_pso/Section{CURRENT_SECTION}.json')
print('Distancia alcanzada', calc_distance(global_best_position, target_coords))
plt.plot(best_global_objectives, marker='o')
plt.xlabel('Iteración')
plt.ylabel('Mejor objetivo global')
plt.title('Convergencia del algoritmo PSO')
plt.grid(True)
plt.savefig('plot_pso.png')
show_solution(I, global_best_position)
