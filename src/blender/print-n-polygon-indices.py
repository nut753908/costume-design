import bpy

# Apply modifiers in advance
obj = bpy.context.active_object
indices = [list(face.vertices) for face in obj.data.polygons]
with open('n-polygon-indices.txt', mode='w') as f:
    f.write(str(indices).replace(' ', ''))
